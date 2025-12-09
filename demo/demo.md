# Markdown Demo

## markmap

```markmap
## マークマップ表示デモ
マインドマップのようにマークダウンの内容を図で表現します。

### 見出しレベル3

- **見出し**:
  情報を整理するための階層構造を作成します。
- **リスト**:
  情報を箇条書きに整理します。
- **強調**:
  **太字**または*斜体*。
- `1行コードフェンス`
- コードフェンス
    ```python
    print("hello")
    ```

### リストの例

マークダウンでは、ハイフン (`-`) やアスタリスク (`*`) を使って簡単にリストを作成できます。

- 最初の項目
- 2番目の項目
  - 入れ子の項目 A
  - 入れ子の項目 B
- 3番目の項目

### 番号付きリストの例

数字とピリオド (`1.`, `2.`) を使用します。

1. ステップ 1: 準備
1. ステップ 2: 実行
1. ステップ 3: [リンク](https://)
1. ステップ 4: 結果を表示

```

## mermaid

```mermaid
graph TD;
    A[開始] --> B[処理];
    B --> C{判断};
    C -- はい --> D[処理1];
    C -- いいえ --> E[処理2];
    D --> F[終了];
    E --> F;
```

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant Database

    Client->>+Server: リクエスト送信
    Server->>+Database: データ問い合わせ
    Database-->>-Server: 結果返却
    Server-->>-Client: レスポンス送信

    Note over Client,Server: REST API通信

    alt データあり
        Client->>Server: データ更新要求
        Server->>Database: 更新実行
    else データなし
        Client->>Server: データ作成要求
        Server->>Database: 作成実行
    end
```

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

```mermaid
stateDiagram-v2
    [*] --> 待機中
    待機中 --> 実行中: 開始
    実行中 --> 完了: 成功
    実行中 --> エラー: 失敗
    完了 --> [*]
    エラー --> 待機中: リトライ
    エラー --> [*]: 中止
```

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

```mermaid
gantt
    title ソフトウェア開発プロジェクト
    dateFormat  YYYY-MM-DD

    section 計画
    プロジェクト開始       :done, a1, 2024-01-01, 2d
    要件分析       :active, a2, after a1, 1w
    システム設計       :a3, after a2, 2w

    section 開発
    バックエンド開発      :crit, a4, after a3, 4w
    フロントエンド開発      :a5, after a3, 4w
    API統合       :a6, after a4, 1w

```

## graphviz

```graphviz
digraph G {
  graph [bgcolor="#000000"];
  node  [
    fontsize=18,
    fontcolor="#ff9bd6",
    color="#00ff66",
    penwidth=2,
  ];
  edge  [
    color="#ff14e0",
    fontcolor="#46d2e8",
    fontsize=14
  ];

  1 -> 2 [label="a"];
  2 -> 3 [label="b"];
  3 -> 1 [label="c"];
}
```

```graphviz
digraph graph_name {
  alpha;
  beta;
  alpha -> beta;
}
```
