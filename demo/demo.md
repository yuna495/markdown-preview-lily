# **Markdown Preview Plus** Demo

## markmap

```markmap
## Markmap Display Demo
Visualizes Markdown content as a diagram like a mind map.

### Heading Level 3

- **Heading**:
  Creates a hierarchical structure to organize information.
- List:
  Organizes information in bullet points.
- **Emphasis**:
  **Bold** or *Italic*.
- `Inline code fence`
- Code fence
    ```python
    print("hello")
    ```

### List Example

* First item
* Second item
  * Nested item A
  * Nested item B
* Third item

### Numbered List Example

1. Step 1: Preparation
1. Step 2: Execution
1. Step 3: [Link](https://)
1. Step 4: Show link destination

```

## mermaid

- Flowchart

```mermaid
graph TD;
    A[Start] --> B[Process];
    B --> C{Decision};
    C -- Yes --> D[Process 1];
    C -- No --> E[Process 2];
    D --> F[End];
    E --> F;
```

- Sequence

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant Database

    Client->>+Server: Send Request
    Server->>+Database: Query Data
    Database-->>-Server: Return Result
    Server-->>-Client: Send Response

    Note over Client,Server: REST API Communication

    alt Data Exists
        Client->>Server: Request Data Update
        Server->>Database: Execute Update
    else No Data
        Client->>Server: Request Data Creation
        Server->>Database: Execute Creation
    end
```

- Class Diagram

```mermaid
classDiagram
    class Person {
        +String name
        +int age
        +getDetails() String
    }

    class Employee {
        +int salary
        +String position
        +calculateBonus() int
    }

    class Manager {
        -List~Employee~ team
        +addTeamMember(Employee) void
    }

    Person <|-- Employee
    Employee <|-- Manager
    Manager o-- Employee
```

- State Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Running: Start
    Running --> Completed: Success
    Running --> Error: Failure
    Completed --> [*]
    Error --> Idle: Retry
    Error --> [*]: Abort
```

- ER Diagram

```mermaid
erDiagram
    USER {
        int id PK
        string username
        string email
        string password_hash
    }

    POST {
        int id PK
        int user_id FK
        string title
        string content
        datetime created_at
    }

    COMMENT {
        int id PK
        int post_id FK
        int user_id FK
        string content
        datetime created_at
    }

    USER ||--o{ POST : writes
    POST ||--o{ COMMENT : has
    USER ||--o{ COMMENT : makes
```

- Gantt Chart

```mermaid
gantt
    title Software Development Project
    dateFormat  YYYY-MM-DD

    section Planning
    Project Start       :done, a1, 2024-01-01, 2d
    Requirement Analysis       :active, a2, after a1, 1w
    System Design       :a3, after a2, 2w

    section Development
    Backend Development      :crit, a4, after a3, 4w
    Frontend Development      :a5, after a3, 4w
    API Integration       :a6, after a4, 1w

```

## graphviz

- Flowchart

```graphviz
digraph graph_name {
  graph [rankdir = LR];
  node [shape = none];

  1 -> 2 -> 3 -> 4 [
    arrowhead = none
  ];
}
```

- Record

```graphviz
digraph graph_name {
  graph [
    charset = "UTF-8",
    bgcolor = "#EDEDED",
    rankdir = TB,
    nodesep = 1.1,
    ranksep = 1.05
  ];

  node [
    shape = record,
    fontname = "Migu 1M",
    fontsize = 12,
  ];

  // node define
  alpha [label = "<pl>left|center|<pr>right"];
  beta [label = "<pl>left|<pc>center|<pr>right"];
  gamma [label = "left|center|<pr>right"];
  delta [label = "{left|{<pc>center|{top|middle|bottom}}|right}}"];
  epsilon [label = "{top|<pm>middle|bottom}"];

  // edge define
  alpha:pl -> beta:pl [ label = "a-b", weight = 2.0];
  alpha:pr -> gamma:pr [label = "a-g", weight = 1.0];
  beta:pc -> epsilon:pm [label = "b-e"];
  gamma -> delta:pc [label = "g-d"];
}
```
