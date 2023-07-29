package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"time"
	"github.com/gorilla/mux"
)

func main() {
	fmt.Println("REST API with GO! => http://localhost:8000")
	r := mux.NewRouter()
	r.HandleFunc("/ping", PingHandler).Methods("GET")
	r.HandleFunc("/user", CreateUserHandler).Methods("POST")
	http.Handle("/",r)

	log.Fatal(http.ListenAndServe(":8000",r))
}

func PingHandler(w http.ResponseWriter, r *http.Request){
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, "Pong")
}

func CreateUserHandler(w http.ResponseWriter, r *http.Request){
	//delay := randomWithRange(1,30)
	//time.Sleep(delay * time.Millisecond)
	w.WriteHeader(http.StatusCreated)
	fmt.Fprint(w, "User created")
}

func randomWithRange(min, max int) time.Duration {
	return time.Duration(min + rand.Intn(max-min)) * time.Millisecond
}