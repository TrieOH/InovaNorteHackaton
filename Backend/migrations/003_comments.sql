-- +goose Up

CREATE TABLE comments (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_child_of BIGINT REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_answer BOOL NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_is_child_of ON comments(is_child_of);

-- +goose Down
DROP TABLE comments;
