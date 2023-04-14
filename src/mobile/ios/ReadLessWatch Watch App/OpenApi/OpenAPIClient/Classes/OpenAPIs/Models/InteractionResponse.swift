//
// InteractionResponse.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

public struct InteractionResponse: Codable, Hashable {

    public var view: Double
    public var uservote: InteractionUserVote?
    public var upvote: Double
    public var share: Double
    public var read: Double
    public var listen: Double
    public var downvote: Double
    public var comment: Double
    public var userFavorited: Bool?
    public var favorite: Double
    public var userBookmarked: Bool?
    public var bookmark: Double

    public init(view: Double, uservote: InteractionUserVote? = nil, upvote: Double, share: Double, read: Double, listen: Double, downvote: Double, comment: Double, userFavorited: Bool? = nil, favorite: Double, userBookmarked: Bool? = nil, bookmark: Double) {
        self.view = view
        self.uservote = uservote
        self.upvote = upvote
        self.share = share
        self.read = read
        self.listen = listen
        self.downvote = downvote
        self.comment = comment
        self.userFavorited = userFavorited
        self.favorite = favorite
        self.userBookmarked = userBookmarked
        self.bookmark = bookmark
    }

    public enum CodingKeys: String, CodingKey, CaseIterable {
        case view
        case uservote
        case upvote
        case share
        case read
        case listen
        case downvote
        case comment
        case userFavorited
        case favorite
        case userBookmarked
        case bookmark
    }

    // Encodable protocol methods

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(view, forKey: .view)
        try container.encodeIfPresent(uservote, forKey: .uservote)
        try container.encode(upvote, forKey: .upvote)
        try container.encode(share, forKey: .share)
        try container.encode(read, forKey: .read)
        try container.encode(listen, forKey: .listen)
        try container.encode(downvote, forKey: .downvote)
        try container.encode(comment, forKey: .comment)
        try container.encodeIfPresent(userFavorited, forKey: .userFavorited)
        try container.encode(favorite, forKey: .favorite)
        try container.encodeIfPresent(userBookmarked, forKey: .userBookmarked)
        try container.encode(bookmark, forKey: .bookmark)
    }
}

