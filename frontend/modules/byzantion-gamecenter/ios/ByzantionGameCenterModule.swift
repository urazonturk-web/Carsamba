import ExpoModulesCore
import GameKit
import UIKit

// Dismisses the Game Center sheet when the player taps Done.
final class GameCenterDismisser: NSObject, GKGameCenterControllerDelegate {
  static let shared = GameCenterDismisser()
  func gameCenterViewControllerDidFinish(_ gameCenterViewController: GKGameCenterViewController) {
    gameCenterViewController.dismiss(animated: true)
  }
}

// MEYDAN OKUMA · ARKADAŞ (2026-11-16): Game Center sıra tabanlı maçı (GKTurnBasedMatch).
// Meydan okuyan: arkadaşını Apple'ın ekranında seçer; maça harita tohumu + skoru yazıp sırayı arkadaşa verir.
// Arkadaş: bildirimle oyuna gelir, aynı haritayı oynar, skorunu yazıp maçı bitirir; meydan okuyana sonuç gider.
final class TurnMatchmakerDelegate: NSObject, GKTurnBasedMatchmakerViewControllerDelegate {
  weak var module: ByzantionGameCenterModule?
  func turnBasedMatchmakerViewControllerWasCancelled(_ viewController: GKTurnBasedMatchmakerViewController) {
    viewController.dismiss(animated: true)
    module?.finishPendingSend(["status": "cancelled"])
  }
  func turnBasedMatchmakerViewController(_ viewController: GKTurnBasedMatchmakerViewController, didFailWithError error: Error) {
    viewController.dismiss(animated: true)
    module?.finishPendingSend(["status": "error", "message": error.localizedDescription])
  }
}

final class TurnListener: NSObject, GKLocalPlayerListener {
  weak var module: ByzantionGameCenterModule?
  func player(_ player: GKPlayer, receivedTurnEventFor match: GKTurnBasedMatch, didBecomeActive: Bool) {
    module?.handleTurnEvent(match)
  }
  func player(_ player: GKPlayer, matchEnded match: GKTurnBasedMatch) {
    module?.handleMatchEnded(match)
  }
}

public class ByzantionGameCenterModule: Module {
  private var pendingAuth: [Promise] = []
  private var handlerInstalled = false
  private let matchmakerDelegate = TurnMatchmakerDelegate()
  private let turnListener = TurnListener()
  private var listenerRegistered = false
  private var pendingSend: (promise: Promise, payload: [String: Any])?
  private weak var matchmakerVC: UIViewController?
  private var friendCache: [String: GKPlayer] = [:]

  private func isLocal(_ p: GKTurnBasedParticipant?) -> Bool {
    guard let id = p?.player?.gamePlayerID else { return false }
    return id == GKLocalPlayer.local.gamePlayerID
  }

  private func decode(_ data: Data?) -> [String: Any]? {
    guard let d = data, !d.isEmpty, let obj = try? JSONSerialization.jsonObject(with: d) as? [String: Any] else { return nil }
    return obj
  }

  private func registerListenerIfNeeded() {
    if listenerRegistered || !GKLocalPlayer.local.isAuthenticated { return }
    listenerRegistered = true
    matchmakerDelegate.module = self
    turnListener.module = self
    GKLocalPlayer.local.register(turnListener)
  }

  func finishPendingSend(_ result: [String: Any]) {
    if let ps = pendingSend {
      pendingSend = nil
      ps.promise.resolve(result)
    }
  }

  private func challengeInfo(_ match: GKTurnBasedMatch, _ data: [String: Any]) -> [String: Any] {
    var info = data
    info["matchID"] = match.matchID
    return info
  }

  func handleTurnEvent(_ match: GKTurnBasedMatch) {
    let data = decode(match.matchData)
    // Yeni kurulan maç ve gönderilmeyi bekleyen meydan okuma: veriyi yaz, sırayı arkadaşa ver.
    if data == nil, isLocal(match.currentParticipant), let ps = pendingSend {
      let others = match.participants.filter { !isLocal($0) }
      guard let payloadData = try? JSONSerialization.data(withJSONObject: ps.payload) else {
        finishPendingSend(["status": "error", "message": "encode"])
        return
      }
      match.endTurn(withNextParticipants: others, turnTimeout: GKTurnTimeoutDefault, match: payloadData) { error in
        DispatchQueue.main.async {
          self.matchmakerVC?.dismiss(animated: true)
          if let error = error {
            self.finishPendingSend(["status": "error", "message": error.localizedDescription])
          } else {
            self.finishPendingSend(["status": "sent", "matchID": match.matchID])
          }
        }
      }
      return
    }
    // Arkadaştan gelen meydan okuma: sıra bizde ve veri var.
    if let d = data, match.status == .open, isLocal(match.currentParticipant), d["reply"] == nil {
      sendEvent("onChallenge", challengeInfo(match, d))
    }
  }

  func handleMatchEnded(_ match: GKTurnBasedMatch) {
    if let d = decode(match.matchData), d["reply"] != nil {
      sendEvent("onChallengeResult", challengeInfo(match, d))
    }
  }

  private func playerInfo() -> [String: Any] {
    let p = GKLocalPlayer.local
    return [
      "authenticated": p.isAuthenticated,
      "displayName": p.isAuthenticated ? p.displayName : "",
      "underage": p.isAuthenticated ? p.isUnderage : false
    ]
  }

  private func flushAuth() {
    registerListenerIfNeeded()
    let info = playerInfo()
    let waiting = pendingAuth
    pendingAuth.removeAll()
    waiting.forEach { $0.resolve(info) }
  }

  public func definition() -> ModuleDefinition {
    Name("ByzantionGameCenter")

    Events("onChallenge", "onChallengeResult")

    // Arkadaş seçme ekranını açar; seçilince maça {seed, score, from} yazılır ve sıra arkadaşa geçer.
    AsyncFunction("challengeFriend") { (seed: Double, score: Int, from: String, promise: Promise) in
      guard GKLocalPlayer.local.isAuthenticated, let presenter = self.appContext?.utilities?.currentViewController() else {
        promise.resolve(["status": "not_signed_in"])
        return
      }
      self.registerListenerIfNeeded()
      self.finishPendingSend(["status": "replaced"])
      self.pendingSend = (promise, ["v": 1, "seed": seed, "score": score, "from": from])
      let request = GKMatchRequest()
      request.minPlayers = 2
      request.maxPlayers = 2
      request.inviteMessage = "Byzantion'da beni geç! \(score) puan yaptım."
      let vc = GKTurnBasedMatchmakerViewController(matchRequest: request)
      vc.showExistingMatches = false
      // Kullanıcı (video 15-09-26): "Otomatik Eşleşme" kalksın -> yalnız arkadaş daveti, yabancıyla eşleşme yok.
      vc.matchmakingMode = .inviteOnly
      vc.turnBasedMatchmakerDelegate = self.matchmakerDelegate
      self.matchmakerVC = vc
      presenter.present(vc, animated: true)
    }.runOnQueue(.main)

    // Kullanıcı: "meydan okumada direk arkadaş listesi açılmalı" -> kendi listemiz.
    // Game Center arkadaşlarını yükler (ilk seferde iOS izin sorar).
    AsyncFunction("loadFriends") { (leaderboardId: String, promise: Promise) in
      guard GKLocalPlayer.local.isAuthenticated else {
        promise.resolve(["status": "not_signed_in", "friends": []])
        return
      }
      // Kullanıcı videosu 15-26: Rekor tablosunda 2 arkadaş var ama loadFriends boş döndü
      // (Apple yalnız oyuna arkadaş izni vermiş arkadaşları verir). Bu yüzden üç kaynak birleşir:
      // 1) loadFriends  2) Rekor tablosunun arkadaş sıralaması  3) son birlikte oynananlar.
      // Kullanıcı: "ilk olarak sıralamadaki arkadaşlar çıksın, sonra diğerleri; yanlarında en yüksek puanları yazsın".
      let me = GKLocalPlayer.local.gamePlayerID
      let lock = NSLock()
      var ranked: [(rank: Int, score: Int, player: GKPlayer)] = []
      var others: [GKPlayer] = []
      var recent: [GKPlayer] = []
      let group = DispatchGroup()
      group.enter()
      GKLocalPlayer.local.loadFriends { friends, _ in
        lock.lock(); others = friends ?? []; lock.unlock()
        group.leave()
      }
      group.enter()
      GKLeaderboard.loadLeaderboards(IDs: [leaderboardId]) { boards, _ in
        guard let board = boards?.first else { group.leave(); return }
        board.loadEntries(for: .friendsOnly, timeScope: .allTime, range: NSRange(location: 1, length: 100)) { _, entries, _, _ in
          lock.lock(); ranked = (entries ?? []).map { (rank: $0.rank, score: $0.score, player: $0.player) }; lock.unlock()
          group.leave()
        }
      }
      group.enter()
      GKLocalPlayer.local.loadRecentPlayers { players, _ in
        lock.lock(); recent = players ?? []; lock.unlock()
        group.leave()
      }
      group.notify(queue: .main) {
        var seen = Set<String>([me])
        var list: [[String: Any]] = []
        func push(_ p: GKPlayer, _ score: Int?) {
          let id = p.gamePlayerID
          guard !seen.contains(id) else { return }
          seen.insert(id)
          self.friendCache[id] = p
          var row: [String: Any] = ["id": id, "name": p.displayName, "alias": p.alias]
          if let score = score { row["score"] = score }
          list.append(row)
        }
        for e in ranked.sorted(by: { $0.rank < $1.rank }) { push(e.player, e.score) }
        for p in others { push(p, nil) }
        for p in recent { push(p, nil) }
        promise.resolve(["status": "ok", "friends": list])
      }
    }

    // Seçilen arkadaşa doğrudan meydan okuma: maç kurulur, veri yazılır, sıra ona geçer.
    // HAYALET YARIŞ: race boş değilse maça yarışın zıplama kaydı (JSON metni) de yazılır.
    AsyncFunction("challengePlayer") { (playerID: String, seed: Double, score: Int, from: String, race: String, promise: Promise) in
      guard GKLocalPlayer.local.isAuthenticated, let friend = self.friendCache[playerID] else {
        promise.resolve(["status": "error", "message": "friend"])
        return
      }
      self.registerListenerIfNeeded()
      let request = GKMatchRequest()
      request.minPlayers = 2
      request.maxPlayers = 2
      request.recipients = [friend]
      request.inviteMessage = race.isEmpty ? "Byzantion'da beni geç! \(score) puan yaptım." : "Byzantion'da 2 dakikalık yarış: \(score). kuleye vardım, geç bakalım!"
      GKTurnBasedMatch.find(for: request) { match, error in
        guard let match = match else {
          promise.resolve(["status": "error", "message": error?.localizedDescription ?? "match"])
          return
        }
        var payload: [String: Any] = ["v": 1, "seed": seed, "score": score, "from": from]
        if !race.isEmpty { payload["race"] = race }
        guard let data = try? JSONSerialization.data(withJSONObject: payload) else {
          promise.resolve(["status": "error", "message": "encode"])
          return
        }
        let others = match.participants.filter { !self.isLocal($0) }
        match.endTurn(withNextParticipants: others, turnTimeout: GKTurnTimeoutDefault, match: data) { err in
          if let err = err { promise.resolve(["status": "error", "message": err.localizedDescription]) }
          else { promise.resolve(["status": "sent", "matchID": match.matchID]) }
        }
      }
    }

    // Bekleyen meydan okumalar (sıra bizde) ve bitmiş sonuçlar.
    AsyncFunction("loadChallenges") { (promise: Promise) in
      guard GKLocalPlayer.local.isAuthenticated else {
        promise.resolve(["incoming": [], "results": []])
        return
      }
      self.registerListenerIfNeeded()
      GKTurnBasedMatch.loadMatches { matches, _ in
        var incoming: [[String: Any]] = []
        var results: [[String: Any]] = []
        for m in matches ?? [] {
          guard let d = self.decode(m.matchData) else { continue }
          if m.status == .open, self.isLocal(m.currentParticipant), d["reply"] == nil {
            incoming.append(self.challengeInfo(m, d))
          } else if m.status == .ended, d["reply"] != nil {
            results.append(self.challengeInfo(m, d))
          }
        }
        promise.resolve(["incoming": incoming, "results": results])
      }
    }

    // Arkadaşın meydan okumasını oynadıktan sonra: skoru yaz, kazanan/kaybedeni işaretle, maçı bitir.
    AsyncFunction("finishChallenge") { (matchID: String, score: Int, name: String, promise: Promise) in
      GKTurnBasedMatch.load(withID: matchID) { match, error in
        guard let match = match, var d = self.decode(match.matchData) else {
          promise.resolve(["status": "error", "message": error?.localizedDescription ?? "load"])
          return
        }
        let target = (d["score"] as? Int) ?? 0
        d["reply"] = score
        d["replier"] = name
        for p in match.participants {
          let mine = self.isLocal(p)
          if score == target { p.matchOutcome = .tied }
          else if score > target { p.matchOutcome = mine ? .won : .lost }
          else { p.matchOutcome = mine ? .lost : .won }
        }
        guard let out = try? JSONSerialization.data(withJSONObject: d) else {
          promise.resolve(["status": "error", "message": "encode"])
          return
        }
        match.endMatchInTurn(withMatch: out) { err in
          if let err = err { promise.resolve(["status": "error", "message": err.localizedDescription]) }
          else { promise.resolve(["status": "done"]) }
        }
      }
    }

    // HAYALET YARIŞ: yarışı oynayan taraf sonucunu yazar. outcome: 1 = ben kazandım, -1 = kaybettim, 0 = berabere.
    AsyncFunction("finishChallengeRace") { (matchID: String, score: Int, name: String, race: String, outcome: Int, promise: Promise) in
      GKTurnBasedMatch.load(withID: matchID) { match, error in
        guard let match = match, var d = self.decode(match.matchData) else {
          promise.resolve(["status": "error", "message": error?.localizedDescription ?? "load"])
          return
        }
        d["reply"] = score
        d["replier"] = name
        d["replyRace"] = race
        for p in match.participants {
          let mine = self.isLocal(p)
          if outcome == 0 { p.matchOutcome = .tied }
          else if outcome > 0 { p.matchOutcome = mine ? .won : .lost }
          else { p.matchOutcome = mine ? .lost : .won }
        }
        guard let out = try? JSONSerialization.data(withJSONObject: d) else {
          promise.resolve(["status": "error", "message": "encode"])
          return
        }
        match.endMatchInTurn(withMatch: out) { err in
          if let err = err { promise.resolve(["status": "error", "message": err.localizedDescription]) }
          else { promise.resolve(["status": "done"]) }
        }
      }
    }

    // Görülmüş bitmiş maçı listeden kaldır (sonuç bir kez gösterilsin).
    AsyncFunction("removeChallenge") { (matchID: String, promise: Promise) in
      GKTurnBasedMatch.load(withID: matchID) { match, _ in
        guard let match = match, match.status == .ended else { promise.resolve(false); return }
        match.remove { err in promise.resolve(err == nil) }
      }
    }

    // MEYDAN OKUMA (2026-11-16): kodu panoya kopyala (yeni paket gerekmeden UIPasteboard).
    Function("copyText") { (text: String) -> Bool in
      UIPasteboard.general.string = text
      return true
    }

    Function("isAuthenticated") { () -> Bool in
      GKLocalPlayer.local.isAuthenticated
    }

    // Installs the authenticate handler once. iOS shows its own Game Center
    // sign-in sheet if needed (only when the handler hands us a controller);
    // a player who already uses Game Center gets the small "Welcome back" banner.
    // PİL = AMCANIN ŞARJI (2026-11-17): izin istemez. level 0..1 (-1 bilinmiyor), state: 1 takılı değil, 2 şarjda, 3 dolu.
    AsyncFunction("battery") { (promise: Promise) in
      let dev = UIDevice.current
      dev.isBatteryMonitoringEnabled = true
      promise.resolve(["level": Double(dev.batteryLevel), "state": dev.batteryState.rawValue])
    }.runOnQueue(.main)

    AsyncFunction("authenticate") { (promise: Promise) in
      if GKLocalPlayer.local.isAuthenticated {
        promise.resolve(self.playerInfo())
        return
      }
      self.pendingAuth.append(promise)
      if self.handlerInstalled { return }
      self.handlerInstalled = true
      GKLocalPlayer.local.authenticateHandler = { [weak self] viewController, _ in
        guard let self = self else { return }
        if let vc = viewController {
          self.appContext?.utilities?.currentViewController()?.present(vc, animated: true)
          return
        }
        self.flushAuth()
      }
    }.runOnQueue(.main)

    AsyncFunction("submitScore") { (score: Int, leaderboardId: String, promise: Promise) in
      guard GKLocalPlayer.local.isAuthenticated else {
        promise.resolve(false)
        return
      }
      GKLeaderboard.submitScore(score, context: 0, player: GKLocalPlayer.local, leaderboardIDs: [leaderboardId]) { error in
        if let error = error {
          promise.reject("E_SUBMIT", error.localizedDescription)
        } else {
          promise.resolve(true)
        }
      }
    }

    AsyncFunction("showLeaderboard") { (leaderboardId: String, promise: Promise) in
      guard let presenter = self.appContext?.utilities?.currentViewController() else {
        promise.resolve(false)
        return
      }
      let vc = GKGameCenterViewController(leaderboardID: leaderboardId, playerScope: .friendsOnly, timeScope: .allTime)
      vc.gameCenterDelegate = GameCenterDismisser.shared
      presenter.present(vc, animated: true)
      promise.resolve(true)
    }.runOnQueue(.main)
  }
}
