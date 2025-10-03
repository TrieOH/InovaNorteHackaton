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

func (h *PostService) CreatePost(ctx context.Context, req models.CreatePostRequest) (*models.PostDTO, *resp.Response) {
	if req.UserID == "" {
		return nil, resp.BadRequest("user_id is required")
	}

	uuid, err := uuid.Parse(req.UserID)
	if err != nil {
		return nil, resp.BadRequest("invalid uuid").AddTrace(err)
	}

	dbPost, err := h.queries.CreatePost(ctx, repository.CreatePostParams{
		UserID: uuid,
		Title: req.Title,
		Content:  req.Content,
	})

	if err != nil {
		return nil, resp.InternalServerError("failed to create post").AddTrace(err)
	}

	var postDTO models.PostDTO
	if err := copier.Copy(&postDTO, &dbPost); err != nil {
		return nil, resp.InternalServerError("failed to create postDTO").AddTrace(err)
	}

	return &postDTO, nil
}

func (h *PostService) UpdatePost(ctx context.Context, post_id string, req models.UpdatePostRequest) (*models.PostDTO, *resp.Response) {
	if post_id == "" {
		return nil, resp.BadRequest("id is required")
	}

	id, err := strconv.Atoi(post_id)
	if err != nil {
		return nil, resp.BadRequest("error converting post_id").AddTrace(err)
	}

	post, err := h.queries.GetPostByID(ctx, id)
	if err != nil {
		return nil, resp.InternalServerError("failed to get post").AddTrace(err)
	}

	if req.UserID == "" {
		return nil, resp.BadRequest("user_id is required")
	}

	uuid, err := uuid.Parse(req.UserID)
	if err != nil {
		return nil, resp.BadRequest("invalid uuid").AddTrace(err)
	}

	if post.UserID != uuid {
		return nil, resp.Unauthorized("user can't edit other users posts")
	}

	var newPost models.PostDTO
	newPost.Title = req.Title
	if req.Title == "" {
		newPost.Title = post.Title
	}
	newPost.Content = req.Content
	if req.Content == "" {
		newPost.Content = post.Content
	}

	dbPost, err := h.queries.UpdatePost(ctx, repository.UpdatePostParams{
		ID: id,
		Title: newPost.Title,
		Content:  newPost.Content,
	})
	if err != nil {
		return nil, resp.InternalServerError("failed to update post").AddTrace(err)
	}

	var postDTO models.PostDTO
	if err := copier.Copy(&postDTO, &dbPost); err != nil {
		return nil, resp.InternalServerError("failed to create postDTO").AddTrace(err)
	}

	return &postDTO, nil
}

func (h *PostService) DeletePost(ctx context.Context, post_id string, req models.DeletePostRequest) *resp.Response {
	if post_id == "" {
		return resp.BadRequest("id is required")
	}

	id, err := strconv.Atoi(post_id)
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

	post, err := h.queries.GetPostByID(ctx, id)
	if err != nil {
		return resp.InternalServerError("failed to get post").AddTrace(err)
	}

	if post.UserID != uuid {
		return resp.Unauthorized("user can't delete other users posts")
	}

	err = h.queries.DeletePost(ctx, post.ID)
	if err != nil {
		return resp.InternalServerError("failed to delete post").AddTrace(err)
	}

	return nil
}

func (h *PostService) GetPostByID(ctx context.Context, post_id string) (*models.PostDTO, *resp.Response) {
	if post_id == "" {
		return nil, resp.BadRequest("id is required")
	}

	id, err := strconv.Atoi(post_id)
	if err != nil {
		return nil, resp.BadRequest("error converting post_id").AddTrace(err)
	}

	dbPost, err := h.queries.GetPostByID(ctx, id)
	if err != nil {
		return nil, resp.InternalServerError("failed to get post").AddTrace(err)
	}

	var postDTO models.PostDTO
	if err := copier.Copy(&postDTO, &dbPost); err != nil {
		return nil, resp.InternalServerError("failed to create postDTO").AddTrace(err)
	}

	return &postDTO, nil
}

func (h *PostService) ListPosts(ctx context.Context) ([]models.PostDTO, *resp.Response) {
	posts, err := h.queries.ListPosts(ctx)
	if err != nil {
		return nil, resp.InternalServerError("failed to fetch all posts").AddTrace(err)
	}

	var postsDTO []models.PostDTO
	if err := copier.Copy(&postsDTO, &posts); err != nil {
		return nil, resp.InternalServerError("failed to create postsDTO").AddTrace(err)
	}

	return postsDTO, nil
}
