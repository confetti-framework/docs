
# Installation

Confetti is a lightweight web framework written in Go that is simple to set up and use. Follow these steps to get started.

## 1. Visit the Confetti Repository

First, go to the [Confetti repository](https://github.com/confetti-framework/confetti) on GitHub.

## 2. Create Your Repository

Click on **"Use this template"** and then **"Create a repository"** to set up your project on GitHub.

## 3. Install Go on Your System

### Mac

- **Using Homebrew:**  
  Open your terminal and run:
  ```sh
  brew install go
  ```
- **Or Download Manually:**  
  Visit the [official Go website](https://golang.org/dl/) and download the macOS installer.

### Windows

- **Download and Install:**  
  Go to the [official Go website](https://golang.org/dl/), download the Windows installer, and follow the installation instructions.

## 4. Build and Run the Application

1. Open your terminal and navigate to your project directory.
2. Build the application:
   ```sh
   go build ./...
   ```
3. Start the API server:
   ```sh
   go run cmd/api/main.go api:serve
   ```
   _With every adjustment you have to cancel the command and run it again._

Once the server is running, the first endpoint will be available at [http://localhost:8080/status](http://localhost:8080/status).
