package service

import (
	"GreetService/internal/models"
	"GreetService/internal/repository"
	"context"
  "strconv"
	resp "github.com/MintzyG/GoResponse/response"
	"github.com/google/uuid"
)

func (h *KarmaService) VotePost(ctx context.Context, req models.VotePostRequest, post_id string) *resp.Response {
	if post_id == "" {
		return resp.BadRequest("post_id is required")
	}

	postId, err := strconv.Atoi(post_id)
	if err != nil {
		return resp.BadRequest("error converting post_id").AddTrace(err)
	}

	if req.UserID == "" {
		return resp.BadRequest("user_id is required")
	}

	uuid, err := uuid.Parse(req.UserID)
	if err != nil {
		return resp.BadRequest("invalid uuid").AddTrace(err)
	}

	_, err = h.queries.VotePost(ctx, repository.VotePostParams{
		UserID: uuid,
		PostID: postId,
		Vote: req.Vote,
	})

	if err != nil {
		return resp.InternalServerError("failed to create vote").AddTrace(err)
	}

	return nil
}

func (h *KarmaService) VoteComment(ctx context.Context, req models.VoteCommentRequest, comment_id string) *resp.Response {
	if comment_id == "" {
		return resp.BadRequest("comment_id is required")
	}

	var comm_id int64
	comm_id, err := strconv.ParseInt(comment_id, 10, 64)
	if err != nil {
		return resp.BadRequest("error converting comment_id").AddTrace(err)
	}

	if req.UserID == "" {
		return resp.BadRequest("user_id is required")
	}

	uuid, err := uuid.Parse(req.UserID)
	if err != nil {
		return resp.BadRequest("invalid uuid").AddTrace(err)
	}

	_, err = h.queries.VoteComment(ctx, repository.VoteCommentParams{
		UserID: uuid,
		CommentID: comm_id,
		Vote: req.Vote,
	})

	if err != nil {
		return resp.InternalServerError("failed to create vote").AddTrace(err)
	}

	return nil
}

func (h *KarmaService) GetPostKarma(ctx context.Context, post_id string) (int, *resp.Response) {
	if post_id == "" {
		return 0, resp.BadRequest("post_id is required")
	}

	postId, err := strconv.Atoi(post_id)
	if err != nil {
		return 0, resp.BadRequest("error converting post_id").AddTrace(err)
	}

	postKarma, err := h.queries.GetPostKarma(ctx, postId)
	if err != nil {
		return 0, resp.InternalServerError("failed to get post karma").AddTrace(err)
	}

	return postKarma, nil
}

func (h *KarmaService) GetCommentKarma(ctx context.Context, comment_id string) (int, *resp.Response) {
	if comment_id == "" {
		return 0, resp.BadRequest("comment_id is required")
	}

	var comm_id int64
	comm_id, err := strconv.ParseInt(comment_id, 10, 64)
	if err != nil {
		return 0, resp.BadRequest("error converting comment_id").AddTrace(err)
	}

	commentKarma, err := h.queries.GetCommentKarma(ctx, comm_id)
	if err != nil {
		return 0, resp.InternalServerError("failed to get post karma").AddTrace(err)
	}

	return commentKarma, nil
}

