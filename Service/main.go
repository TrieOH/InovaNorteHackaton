package main

import (
	"log"
	"net/http"

	"GreetService/internal/router"
)

func main() {
	defer Db.Close()
	mux := router.CreateRouter(Db)

	log.Printf("Server listening on :%s", Port)
	log.Fatal(http.ListenAndServe(":"+Port, mux))
}
