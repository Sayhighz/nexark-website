# Multi-stage build for the Nexark User API
# 1) Builder
FROM golang:1.23-alpine AS builder

WORKDIR /src

# Install required packages for build (certs, tzdata, git for go modules)
RUN apk add --no-cache ca-certificates tzdata git

# Cache dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the source
COPY . .

# Build static binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags "-s -w" -o /out/server ./cmd/api

# 2) Runtime
FROM alpine:3.19

# Install runtime dependencies
RUN apk add --no-cache ca-certificates tzdata

WORKDIR /app

# Copy binary from builder
COPY --from=builder /out/server /app/server

# Non-root user
USER 65532:65532

ENV GIN_MODE=release
ENV PORT=8080

EXPOSE 8080

# Start the server
ENTRYPOINT ["/app/server"]