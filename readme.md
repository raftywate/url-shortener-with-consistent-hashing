# Distributed URL Shortener

A scalable distributed URL shortener built using **Spring Boot**, **Redis**, **PostgreSQL**, **Consistent Hashing**, **Virtual Nodes**, **Rate Limiting**, and **Docker**.

Designed to simulate real-world distributed backend system concepts including shard routing, cache optimization, node distribution, and fault tolerance visualization.

---

# 🚀 Features

- Distributed URL shortening architecture
- Consistent hashing based shard routing
- Virtual nodes for balanced distribution
- Logical shard routing using PostgreSQL-backed partition ownership
- Redis caching with TTL support
- Rate limiting using Redis
- Redirect analytics tracking
- Interactive hash ring visualization
- Node failure simulation
- Live analytics dashboard
- Dockerized full-stack deployment
- Stateless shard routing architecture
- URL normalization support
- Base62 short code generation

# 🧩 Architecture Decisions

## Why Logical Sharding Instead of Physical DB Shards?

The project currently implements logical shard routing using consistent hashing and virtual nodes within a shared PostgreSQL deployment.

This approach was intentionally chosen to:

- focus on distributed routing logic
- simulate shard ownership
- visualize vnode distribution
- minimize infrastructure complexity during development

The routing layer is designed so physical multi-database sharding can be introduced later with minimal architectural changes.

---

# 🏗️ System Architecture

## High-Level Architecture

![Architecture](docs/images/architecture.png)

---

## Consistent Hashing Ring

![Hash Ring](docs/images/hash-ring.png)

---

# 🔄 Request Flows

## URL Shortening Flow

![URL Shortening Flow](docs/images/url-shortening-flow.png)

### Flow

1. User submits URL from frontend
2. Backend generates Base62 short code
3. Consistent hashing determines shard ownership
4. URL mapping stored in shard database
5. Global lookup table updated
6. Short URL returned to client

---

## Redirect + Cache Flow

![Redirect Flow](docs/images/redirect-flow.png)

### Flow

1. User hits shortened URL
2. Redis cache checked first
3. Cache hit → immediate redirect
4. Cache miss → shard lookup
5. Result cached with TTL
6. Redirect response returned

---

## Rate Limiting Flow

![Rate Limiting Flow](docs/images/rate-limiting-flow.png)

### Flow

1. Request received
2. Redis counter incremented
3. Threshold checked
4. Allowed requests continue
5. Excess requests rejected with rate limit response

---

# 🧠 Distributed Systems Concepts

## Consistent Hashing

The project uses consistent hashing to distribute short URLs across shards.

### Benefits

- Minimal redistribution during node addition/removal
- Better scalability
- Predictable shard ownership
- Reduced remapping cost

---

## Virtual Nodes

Each physical shard is represented by multiple virtual nodes on the hash ring.

### Benefits

- Better load balancing
- Reduced hotspot formation
- More even distribution
- Improved scaling behavior

---

## Stateless Routing

The backend dynamically determines shard ownership using consistent hashing instead of maintaining persistent database connection state.

### Benefits

- Better scalability
- Safer concurrent request handling
- Easier horizontal scaling
- Reduced connection leakage risks

---

# ⚡ Redis Caching

Redis is used for:

- URL redirect caching
- TTL-based cache expiration
- Rate limiting counters
- Analytics metrics

### Benefits

- Faster redirects
- Reduced database load
- Lower latency
- Improved throughput

---

# 📊 Analytics Dashboard

The frontend dashboard includes:

- Redirect analytics
- Cache hit/miss metrics
- Shard distribution metrics
- Hash ring visualization
- Node ownership visualization
- Node failure simulation
- Live telemetry polling

---

# 🛠️ Tech Stack

## Backend

- Java
- Spring Boot
- Spring Data JPA
- PostgreSQL
- Redis

## Frontend

- React
- Vite
- TailwindCSS
- Axios

## DevOps

- Docker
- Docker Compose

---

# 🐳 Docker Setup

## Clone Repository

```bash
git clone https://github.com/raftywate/url-shortener-with-consistent-hashing.git
cd url-shortener-with-consistent-hashing
```

## Run Application


```bash
docker compose up --build
```


---

## Services

| Service    | Port |
| ---------- | ---- |
| Frontend   | 5173 |
| Backend    | 8080 |
| PostgreSQL | 5432 |
| Redis      | 6379 |

---

# 🌐 API Endpoints

## Create Short URL

```
POST/Shorten
```

### Request Body

```
{
"url" : "https://www.example.com"
}
```

---

## Redirect URL

```
GET/r/{shortCode}
```

---

## Analytics

```
GET/analytics
```

---

# 📸 Screenshots

## Dashboard

![img](docs/images/Dashboard.png)

---

## Hash Ring Visualization

![i](docs/images/hashring.png)

---

## Analytics Cards

![ ](docs/images/analytics.png)

---

# 📈 Scalability Considerations

The architecture is designed to simulate scalable distributed backend behavior:

* Stateless routing
* Shard-based partitioning
* Cache-first redirects
* Horizontal scalability concepts
* Virtual node distribution
* Reduced remapping during scaling

---



# 🧩 Architecture Decisions

## Why Logical Sharding Instead of Physical DB Shards?

The project currently implements logical shard routing using consistent hashing and virtual nodes within a shared PostgreSQL deployment.

This approach was intentionally chosen to:

- focus on distributed routing logic
- simulate shard ownership
- visualize vnode distribution
- minimize infrastructure complexity during development

The routing layer is designed so physical multi-database sharding can be introduced later with minimal architectural changes.

---



# 🔮 Future Improvements

* Kubernetes deployment
* Prometheus + Grafana observability
* Distributed Redis cluster
* Kafka-based analytics pipeline
* ClickHouse analytics storage
* JWT authentication
* Custom aliases
* URL expiration support
* Multi-region deployment
* Distributed tracing

---

# 🧪 Local Development

## Backend

```
cd backend
mvn spring-boot:run
```

---

## Frontend

```
cd frontend
npm install
npm run dev
```

---

# 👨‍💻 Author

**Abhishek Kumar Gupta**

Distributed Systems | Backend Engineering | Java | Spring Boot
