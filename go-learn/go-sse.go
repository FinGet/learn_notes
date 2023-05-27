package main

import (
   "fmt"
   "net/http"
   "time"
)

type SSE struct {
}

func (sse *SSE) ServeHTTP(rw http.ResponseWriter, req *http.Request) {
   flusher, ok := rw.(http.Flusher)
   if !ok {
      http.Error(rw, "Streaming unsupported!", http.StatusInternalServerError)
      return
   }

   rw.Header().Set("Content-Type", "text/event-stream")
   rw.Header().Set("Cache-Control", "no-cache")
   rw.Header().Set("Connection", "keep-alive")
   rw.Header().Set("Access-Control-Allow-Origin", "*")
   for {
      select {
      case <-req.Context().Done():
         fmt.Println("req done...")
         return
      case <-time.After(500 * time.Millisecond):
         // 返回数据包含id、event(非必须)、data，结尾必须使用\n\n
         fmt.Fprintf(rw, "id: %d\nevent: ping \ndata: %d\n\n", time.Now().Unix(), time.Now().Unix())
         flusher.Flush()
      }
   }

}

func SendData(data chan int64) chan int64 {
   for {
      data <- time.Now().Unix()
      time.Sleep(time.Second * time.Duration(2))
   }
}
func main() {
   http.Handle("/sse", &SSE{})
   http.ListenAndServe(":8080", nil)
}