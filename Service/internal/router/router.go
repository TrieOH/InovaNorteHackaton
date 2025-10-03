//go:build !test
// +build !test

package router

import (
	"net/http"

	"GreetService/internal/handler"
	"GreetService/internal/metrics"
	"GreetService/internal/logs"
	"GreetService/internal/repository"
	"GreetService/internal/service"
	"database/sql"

	_ "GreetService/docs"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
	"github.com/swaggo/http-swagger"
)

// @title        Greet Service API
// @version      0.1
// @description  This is the GreetService API that handles user greetings.

// @contact.name   TrieOH Support
// @contact.url    https://github.com/TrieOH

// @host      localhost:8080
// @BasePath  /
func CreateRouter(db *sql.DB) http.Handler {
	queries := repository.New(db)
	service := service.NewUserService(queries)
	handler := handler.NewUserHandler(service)

	mux := http.NewServeMux()
	mux.Handle("/swagger/", httpSwagger.WrapHandler)

	mux.HandleFunc("POST /users", handler.CreateUser)
	mux.HandleFunc("GET /users", handler.ListUsers)
	mux.HandleFunc("GET /users/{user_id}", handler.GetUserByID)
	mux.HandleFunc("GET /users/{user_id}", handler.ListUsers)
	mux.HandleFunc("PATCH /users/{user_id}", handler.UpdateUser)
	mux.HandleFunc("DELETE /users/{user_id}", handler.DeleteUser)

	mux.Handle("GET /metrics", metrics.Handler())
	withMetrics := metrics.MetricsMW(mux)
	withLogging := logs.LogsMW(withMetrics)
	withID := logs.RequestIDMW(withLogging)

	withCors := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE"},
		AllowedHeaders:   []string{"Content-Type", "Authorization", "Refresh"},
		AllowCredentials: true,
	}).Handler(withID)

	return withCors
}
