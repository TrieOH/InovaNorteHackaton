package handler

import (
	"GreetService/internal/models"
	"GreetService/internal/validation"
	resp "github.com/MintzyG/GoResponse/response"
	"net/http"
)

// CreateComment godoc
// @Description Creates a new comment
// @Tags comments
// @Accept json
// @Produce json
// @Param post_id path string true "Post ID"
// @Param comment body models.CreateCommentRequest true "Comment info"
// @Success 201 {object} models.CommentDTO
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /posts/{post_id}/comments [post]
func (h *CommentHandler) CreateComment(w http.ResponseWriter, r *http.Request) {
	var req models.CreateCommentRequest
	if rs := validation.ValidateWith(r, &req); rs != nil {
		rs.Send(w)
		return
	}

	comment, rs := h.CommentService.CreateComment(r.Context(), req, r.PathValue("post_id"))
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.Created("Created Comment").WithData(comment).Send(w)
}

// GetCommentByID godoc
// @Description Gets a comment
// @Tags comments
// @Accept json
// @Produce json
// @Param comment_id path string true "Comment ID"
// @Success 200 {object} models.CommentDTO
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /comments/{comment_id} [get]
func (h *CommentHandler) GetCommentByID(w http.ResponseWriter, r *http.Request) {
	comment, rs := h.CommentService.GetCommentByID(r.Context(), r.PathValue("comment_id"))
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.OK().WithData(comment).Send(w)
}

// UpdateComment godoc
// @Description Updates a comment
// @Tags comments
// @Accept json
// @Produce json
// @Param post_id path string true "Post ID"
// @Param comment_id path string true "Comment ID"
// @Param comment body models.UpdateCommentRequest true "Comment info"
// @Success 200 {object} models.CommentDTO
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /posts/{post_id}/comments/{comment_id} [patch]
func (h *CommentHandler) UpdateComment(w http.ResponseWriter, r *http.Request) {
	var req models.UpdateCommentRequest
	if rs := validation.ValidateWith(r, &req); rs != nil {
		rs.Send(w)
		return
	}

	comment, rs := h.CommentService.UpdateComment(r.Context(), r.PathValue("comment_id"), req, r.PathValue("post_id"))
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.Created("Updated").WithData(comment).Send(w)
}

// DeleteComment godoc
// @Description Delete a Comment
// @Tags comments
// @Accept json
// @Produce json
// @Param post_id path string true "Post ID"
// @Param comment_id path string true "Comment ID"
// @Param req body models.DeleteCommentRequest true "Delete Info"
// @Success 200 {object} models.SuccessResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /posts/{post_id}/comments/{comment_id} [delete]
func (h *CommentHandler) DeleteComment(w http.ResponseWriter, r *http.Request) {
	var req models.DeleteCommentRequest
	if rs := validation.ValidateWith(r, &req); rs != nil {
		rs.Send(w)
		return
	}

	rs := h.CommentService.DeleteComment(r.Context(), r.PathValue("comment_id"), req, r.PathValue("post_id"))
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.Created("Deleted Comment").Send(w)
}

// ListComments godoc
// @Description List all comments in the system
// @Tags comments
// @Accept json
// @Produce json
// @Success 200 {array} models.CommentDTO
// @Failure 500 {object} models.ErrorResponse
// @Router /comments [get]
func (h *CommentHandler) ListComments(w http.ResponseWriter, r *http.Request) {
	comments, rs := h.CommentService.ListComments(r.Context())
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.OK().WithData(comments).Send(w)
}

// ListCommentsByPost godoc
// @Description List all comments in a post
// @Tags comments
// @Accept json
// @Produce json
// @Param post_id path string true "Post ID"
// @Success 200 {array} models.CommentDTO
// @Failure 500 {object} models.ErrorResponse
// @Router /posts/{post_id}/comments [get]
func (h *CommentHandler) ListCommentsByPost(w http.ResponseWriter, r *http.Request) {
	comments, rs := h.CommentService.ListCommentsByPost(r.Context(), r.PathValue("post_id"))
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.OK().WithData(comments).Send(w)
}

// ListUserComments godoc
// @Description List all user comments
// @Tags comments
// @Accept json
// @Produce json
// @Param user_id path string true "User ID"
// @Success 200 {array} models.CommentDTO
// @Failure 500 {object} models.ErrorResponse
// @Router /users/{user_id}/comments [get]
func (h *CommentHandler) ListUserComments(w http.ResponseWriter, r *http.Request) {
	comments, rs := h.CommentService.ListUserComments(r.Context(), r.PathValue("user_id"))
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.OK().WithData(comments).Send(w)
}

// ListChildComments godoc
// @Description List all children of a specific comment
// @Tags comments
// @Accept json
// @Produce json
// @Param comment_id path string true "Comment ID"
// @Success 200 {array} models.CommentDTO
// @Failure 500 {object} models.ErrorResponse
// @Router /comments/{comment_id}/children [get]
func (h *CommentHandler) ListChildComments(w http.ResponseWriter, r *http.Request) {
	comments, rs := h.CommentService.ListChildComments(r.Context(), r.PathValue("comment_id"))
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.OK().WithData(comments).Send(w)
}
