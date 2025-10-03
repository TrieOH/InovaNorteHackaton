package service

import (
	"GreetService/internal/models"
	"GreetService/internal/repository"
	"context"
  "strconv"
	resp "github.com/MintzyG/GoResponse/response"
	"github.com/google/uuid"
	"github.com/jinzhu/copier"
)

func (h *CommentService) CreateComment(ctx context.Context, req models.CreateCommentRequest, post_id string) (*models.CommentDTO, *resp.Response) {
	if post_id == "" {
		return nil, resp.BadRequest("post_id is required")
	}

	postId, err := strconv.Atoi(post_id)
	if err != nil {
		return nil, resp.BadRequest("error converting post_id").AddTrace(err)
	}

	if req.UserID == "" {
		return nil, resp.BadRequest("user_id is required")
	}

	uuid, err := uuid.Parse(req.UserID)
	if err != nil {
		return nil, resp.BadRequest("invalid uuid").AddTrace(err)
	}

	dbComment, err := h.queries.CreateComment(ctx, repository.CreateCommentParams{
		UserID: uuid,
		PostID: postId,
		IsChildOf: req.IsChildOf,
		IsAnswer: false,
		Content:  req.Content,
	})

	if err != nil {
		return nil, resp.InternalServerError("failed to create post").AddTrace(err)
	}

	var commentDTO models.CommentDTO
	if err := copier.Copy(&commentDTO, &dbComment); err != nil {
		return nil, resp.InternalServerError("failed to create commentDTO").AddTrace(err)
	}

	return &commentDTO, nil
}

func (h *CommentService) UpdateComment(ctx context.Context, comment_id string, req models.UpdateCommentRequest, post_id string) (*models.CommentDTO, *resp.Response) {
	if post_id == "" {
		return nil, resp.BadRequest("post_id is required")
	}

	postId, err := strconv.Atoi(post_id)
	if err != nil {
		return nil, resp.BadRequest("error converting post_id").AddTrace(err)
	}

	if comment_id == "" {
		return nil, resp.BadRequest("id is required")
	}

	var id int64
	id, err = strconv.ParseInt(comment_id, 10, 64)
	if err != nil {
		return nil, resp.BadRequest("error converting comment_id").AddTrace(err)
	}

	comment, err := h.queries.GetCommentByID(ctx, id)
	if err != nil {
		return nil, resp.InternalServerError("failed to get comment").AddTrace(err)
	}

	if comment.PostID != postId {
		return nil, resp.BadRequest("Can't edit a comment from another post")
	}

	if req.UserID == "" {
		return nil, resp.BadRequest("user_id is required")
	}

	uuid, err := uuid.Parse(req.UserID)
	if err != nil {
		return nil, resp.BadRequest("invalid uuid").AddTrace(err)
	}

	if comment.UserID != uuid {
		return nil, resp.Unauthorized("user can't edit other users comments")
	}

	var newComment models.CommentDTO
	if req.Content == "" {
		newComment.Content = comment.Content
	} else {
		newComment.Content = req.Content
	}

	newComment.IsAnswer = req.IsAnswer

	dbComment, err := h.queries.UpdateComment(ctx, repository.UpdateCommentParams{
		ID: id,
		Content:  newComment.Content,
		IsAnswer:  newComment.IsAnswer,
	})
	if err != nil {
		return nil, resp.InternalServerError("failed to update comment").AddTrace(err)
	}

	var commentDTO models.CommentDTO
	if err := copier.Copy(&commentDTO, &dbComment); err != nil {
		return nil, resp.InternalServerError("failed to create commentDTO").AddTrace(err)
	}

	return &commentDTO, nil
}

func (h *CommentService) DeleteComment(ctx context.Context, comment_id string, req models.DeleteCommentRequest, post_id string) *resp.Response {
	if post_id == "" {
		return resp.BadRequest("post_id is required")
	}

	postId, err := strconv.Atoi(post_id)
	if err != nil {
		return resp.BadRequest("error converting post_id").AddTrace(err)
	}

	if comment_id == "" {
		return resp.BadRequest("id is required")
	}

	var id int64
	id, err = strconv.ParseInt(comment_id, 10, 64)
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

	comment, err := h.queries.GetCommentByID(ctx, id)
	if err != nil {
		return resp.InternalServerError("failed to get comment").AddTrace(err)
	}

	if comment.PostID != postId {
		return resp.BadRequest("can't delete a comment from another post")
	}

	if comment.UserID != uuid {
		return resp.Unauthorized("user can't delete other users comments")
	}

	err = h.queries.DeleteComment(ctx, comment.ID)
	if err != nil {
		return resp.InternalServerError("failed to delete comment").AddTrace(err)
	}

	return nil
}

func (h *CommentService) GetCommentByID(ctx context.Context, comment_id string) (*models.CommentDTO, *resp.Response) {
	if comment_id == "" {
		return nil, resp.BadRequest("id is required")
	}

	var id int64
	id, err := strconv.ParseInt(comment_id, 10, 64)
	if err != nil {
		return nil, resp.BadRequest("error converting comment_id").AddTrace(err)
	}

	dbComment, err := h.queries.GetCommentByID(ctx, id)
	if err != nil {
		return nil, resp.InternalServerError("failed to get comment").AddTrace(err)
	}

	var commentDTO models.CommentDTO
	if err := copier.Copy(&commentDTO, &dbComment); err != nil {
		return nil, resp.InternalServerError("failed to create commentDTO").AddTrace(err)
	}

	return &commentDTO, nil
}

func (h *CommentService) ListComments(ctx context.Context) ([]models.CommentDTO, *resp.Response) {
	comments, err := h.queries.ListComments(ctx)
	if err != nil {
		return nil, resp.InternalServerError("failed to fetch all comments").AddTrace(err)
	}

	var commentsDTO []models.CommentDTO
	if err := copier.Copy(&commentsDTO, &comments); err != nil {
		return nil, resp.InternalServerError("failed to create commentsDTO").AddTrace(err)
	}

	return commentsDTO, nil
}

func (h *CommentService) ListCommentsByPost(ctx context.Context, post_id string) ([]models.CommentDTO, *resp.Response) {
	if post_id == "" {
		return nil, resp.BadRequest("post_id is required")
	}

	postId, err := strconv.Atoi(post_id)
	if err != nil {
		return nil, resp.BadRequest("error converting post_id").AddTrace(err)
	}

	comments, err := h.queries.ListCommentsByPost(ctx, postId)
	if err != nil {
		return nil, resp.InternalServerError("failed to fetch all post comments").AddTrace(err)
	}

	var commentsDTO []models.CommentDTO
	if err := copier.Copy(&commentsDTO, &comments); err != nil {
		return nil, resp.InternalServerError("failed to create commentsDTO").AddTrace(err)
	}

	return commentsDTO, nil
}

func (h *CommentService) ListUserComments(ctx context.Context, user_id string) ([]models.CommentDTO, *resp.Response) {
	if user_id == "" {
		return nil, resp.BadRequest("user_id is required")
	}

	uuid, err := uuid.Parse(user_id)
	if err != nil {
		return nil, resp.BadRequest("invalid uuid").AddTrace(err)
	}

	comments, err := h.queries.ListUserComments(ctx, uuid)
	if err != nil {
		return nil, resp.InternalServerError("failed to fetch all user's comments").AddTrace(err)
	}

	var commentsDTO []models.CommentDTO
	if err := copier.Copy(&commentsDTO, &comments); err != nil {
		return nil, resp.InternalServerError("failed to create commentsDTO").AddTrace(err)
	}

	return commentsDTO, nil
}

func (h *CommentService) ListChildComments(ctx context.Context, comment_id string) ([]models.CommentDTO, *resp.Response) {
	if comment_id == "" {
		return nil, resp.BadRequest("comment_id is required")
	}

	var id int64
	id, err := strconv.ParseInt(comment_id, 10, 64)
	if err != nil {
		return nil, resp.BadRequest("error converting comment_id").AddTrace(err)
	}

	comments, err := h.queries.ListChildComments(ctx, &id)
	if err != nil {
		return nil, resp.InternalServerError("failed to fetch child comments").AddTrace(err)
	}

	var commentsDTO []models.CommentDTO
	if err := copier.Copy(&commentsDTO, &comments); err != nil {
		return nil, resp.InternalServerError("failed to create commentsDTO").AddTrace(err)
	}

	return commentsDTO, nil
}
