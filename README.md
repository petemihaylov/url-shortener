# URL Shortener Service

A scalable URL shortener service built with TypeScript and Clean Architecture principles.
![image](https://github.com/user-attachments/assets/27ba8afb-c5e4-446a-b1dd-007967bd9758)

## Features

- Create shortened URLs
- Custom alias support (up to 16 characters)
- Click tracking and analytics
- RESTful API with Swagger documentation
- In-memory SQLite database
- Clean Architecture implementation
- CQRS pattern
- Comprehensive test coverage

## Architecture

The project follows Clean Architecture principles with the following layers:

- **Core**: Contains entities and repository interfaces
- **Application**: Implements use cases (commands and queries)
- **Infrastructure**: Contains concrete implementations (database, external services)
- **API**: Handles HTTP routes and controllers

## API Endpoints

- `POST /api/urls`: Create a new shortened URL
- `GET /:shortCode`: Redirect to original URL
- `GET /api/urls/most-clicked`: Get most clicked URLs

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. View API documentation:
   Open http://localhost:3000/documentation

## Testing

Run the test suite:
```bash
npm test
```

## Design Decisions

1. **Clean Architecture**: Ensures separation of concerns and maintainability
2. **CQRS Pattern**: Separates read and write operations
3. **In-memory SQLite**: Fast and reliable for development/testing
4. **Fastify**: High-performance web framework
5. **Zod**: Runtime validation for request payloads
6. **nanoid**: Generates unique, URL-safe identifiers

## Performance Considerations

- In-memory database for fast access
- Efficient URL lookup using indexes
- Minimal dependencies
- Request validation at the edge
