package handler

import (
	"GreetService/internal/models"
	"GreetService/internal/validation"
	resp "github.com/MintzyG/GoResponse/response"
	"net/http"
)

// CreatePost godoc
// @Description Creates a new post
// @Tags posts
// @Accept json
// @Produce json
// @Param post body models.CreatePostRequest true "Post info"
// @Success 201 {object} models.PostDTO
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /posts [post]
func (h *PostHandler) CreatePost(w http.ResponseWriter, r *http.Request) {
	var req models.CreatePostRequest
	if rs := validation.ValidateWith(r, &req); rs != nil {
		rs.Send(w)
		return
	}

	post, rs := h.PostService.CreatePost(r.Context(), req)
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.Created("Created Post").WithData(post).Send(w)
}

// GetPostByID godoc
// @Description Gets a Post
// @Tags posts
// @Accept json
// @Produce json
// @Param post_id path string true "Post ID"
// @Success 200 {object} models.PostDTO
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /posts/{post_id} [get]
func (h *PostHandler) GetPostByID(w http.ResponseWriter, r *http.Request) {
	post, rs := h.PostService.GetPostByID(r.Context(), r.PathValue("post_id"))
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.OK().WithData(post).Send(w)
}

// UpdatePost godoc
// @Description Updates a post
// @Tags posts
// @Accept json
// @Produce json
// @Param post body models.UpdateUserRequest true "Post info"
// @Param post_id path string true "Post ID"
// @Success 200 {object} models.PostDTO
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /posts/{post_id} [patch]
func (h *PostHandler) UpdatePost(w http.ResponseWriter, r *http.Request) {
	var req models.UpdatePostRequest
	if rs := validation.ValidateWith(r, &req); rs != nil {
		rs.Send(w)
		return
	}

	post, rs := h.PostService.UpdatePost(r.Context(), r.PathValue("post_id"), req)
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.Created("Updated").WithData(post).Send(w)
}

// DeletePost godoc
// @Description Delete a Post
// @Tags posts
// @Accept json
// @Produce json
// @Param post_id path string true "Post ID"
// @Param req body models.DeletePostRequest true "Delete Info"
// @Success 200 {object} models.SuccessResponse
// @Failure 400 {object} models.ErrorResponse
// @Failure 500 {object} models.ErrorResponse
// @Router /posts/{post_id} [delete]
func (h *PostHandler) DeletePost(w http.ResponseWriter, r *http.Request) {
	var req models.DeletePostRequest
	if rs := validation.ValidateWith(r, &req); rs != nil {
		rs.Send(w)
		return
	}

	rs := h.PostService.DeletePost(r.Context(), r.PathValue("post_id"), req)
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.Created("Deleted Post").Send(w)
}

// ListPosts godoc
// @Description List all posts in the system
// @Tags posts
// @Accept json
// @Produce json
// @Success 200 {array} models.PostDTO
// @Failure 500 {object} models.ErrorResponse
// @Router /posts [get]
func (h *PostHandler) ListPosts(w http.ResponseWriter, r *http.Request) {
	posts, rs := h.PostService.ListPosts(r.Context())
	if rs != nil {
		rs.Send(w)
		return
	}

	resp.OK().WithData(posts).Send(w)
}

