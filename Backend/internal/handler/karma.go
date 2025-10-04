package handler

import (
	"GreetService/internal/models"
	"GreetService/internal/validation"
	resp "github.com/MintzyG/GoResponse/response"
	"net/http"
)

// VotePost godoc
// @Description lets a user vote on a post
// @Description Vote variable must be either 1 or -1
// @Tags karma
// @Accept json
// @Produce json
// @Param post_id path string true "Post ID"
// @Param vote body models.VotePostRequest true "Vote info"
// @Success 200 {string} string "OK"
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /posts/{post_id}/vote [post]
func (h *KarmaHandler) VotePost(w http.ResponseWriter, r *http.Request) {
	var req models.VotePostRequest
	if rs := validation.ValidateWith(r, &req); rs != nil {
		rs.Send(w)
		return
	}

	rs := h.KarmaService.VotePost(r.Context(), req, r.PathValue("post_id"))
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.Created("Voted").Send(w)
}

// VoteComment godoc
// @Description lets a user vote on a comment
// @Description Vote variable must be either 1 or -1
// @Tags karma
// @Accept json
// @Produce json
// @Param comment_id path string true "Comment ID"
// @Param vote body models.VoteCommentRequest true "Vote info"
// @Success 200 {string} string "OK"
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /comments/{comment_id}/vote [post]
func (h *KarmaHandler) VoteComment(w http.ResponseWriter, r *http.Request) {
	var req models.VoteCommentRequest
	if rs := validation.ValidateWith(r, &req); rs != nil {
		rs.Send(w)
		return
	}

	rs := h.KarmaService.VoteComment(r.Context(), req, r.PathValue("comment_id"))
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.Created("Voted").Send(w)
}

// GetPostKarma godoc
// @Description Gets the karma from a post
// @Tags karma
// @Accept json
// @Produce json
// @Param post_id path string true "Post ID"
// @Success 200 {object} int
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /posts/{post_id}/karma [get]
func (h *KarmaHandler) GetPostKarma(w http.ResponseWriter, r *http.Request) {
	karma, rs := h.KarmaService.GetPostKarma(r.Context(), r.PathValue("post_id"))
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.OK().WithData(karma).Send(w)

}

// GetCommentKarma godoc
// @Description Gets the karma from a comment
// @Tags karma
// @Accept json
// @Produce json
// @Param comment_id path string true "Comment ID"
// @Success 200 {object} int
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /comments/{comment_id}/karma [get]
func (h *KarmaHandler) GetCommentKarma(w http.ResponseWriter, r *http.Request) {
	karma, rs := h.KarmaService.GetCommentKarma(r.Context(), r.PathValue("comment_id"))
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.OK().WithData(karma).Send(w)
}

// GetUserPostKarma godoc
// @Description Gets the total post karma for a user
// @Tags karma
// @Accept json
// @Produce json
// @Param user_id path string true "User ID"
// @Success 200 {object} int
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /users/{user_id}/karma/posts [get]
func (h *KarmaHandler) GetUserPostKarma(w http.ResponseWriter, r *http.Request) {
	karma, rs := h.KarmaService.GetUserPostKarma(r.Context(), r.PathValue("user_id"))
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.OK().WithData(karma).Send(w)
}

// GetUserCommentKarma godoc
// @Description Gets the total comment karma for a user
// @Tags karma
// @Accept json
// @Produce json
// @Param user_id path string true "User ID"
// @Success 200 {object} int
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /users/{user_id}/karma/comments [get]
func (h *KarmaHandler) GetUserCommentKarma(w http.ResponseWriter, r *http.Request) {
	karma, rs := h.KarmaService.GetUserCommentKarma(r.Context(), r.PathValue("user_id"))
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.OK().WithData(karma).Send(w)
}

// GetUserTotalKarma godoc
// @Description Gets the total karma (posts + comments) for a user
// @Tags karma
// @Accept json
// @Produce json
// @Param user_id path string true "User ID"
// @Success 200 {object} int
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /users/{user_id}/karma [get]
func (h *KarmaHandler) GetUserTotalKarma(w http.ResponseWriter, r *http.Request) {
	karma, rs := h.KarmaService.GetUserTotalKarma(r.Context(), r.PathValue("user_id"))
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.OK().WithData(karma).Send(w)
}
