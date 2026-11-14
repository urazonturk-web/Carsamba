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

public class ByzantionGameCenterModule: Module {
  private var pendingAuth: [Promise] = []
  private var handlerInstalled = false

  private func playerInfo() -> [String: Any] {
    let p = GKLocalPlayer.local
    return [
      "authenticated": p.isAuthenticated,
      "displayName": p.isAuthenticated ? p.displayName : "",
      "underage": p.isAuthenticated ? p.isUnderage : false
    ]
  }

  private func flushAuth() {
    let info = playerInfo()
    let waiting = pendingAuth
    pendingAuth.removeAll()
    waiting.forEach { $0.resolve(info) }
  }

  public func definition() -> ModuleDefinition {
    Name("ByzantionGameCenter")

    Function("isAuthenticated") { () -> Bool in
      GKLocalPlayer.local.isAuthenticated
    }

    // Installs the authenticate handler once. iOS shows its own Game Center
    // sign-in sheet if needed (only when the handler hands us a controller);
    // a player who already uses Game Center gets the small "Welcome back" banner.
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
