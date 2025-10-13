---
title: "TypeScript 类型体操：从入门到精通"
date: "2025-01-08"
tags: ["TypeScript", "编程语言", "最佳实践"]
cover: "/images/covers/typescript.jpg"
summary: "TypeScript 的类型系统远比你想象的强大。本文将带你深入了解高级类型特性，包括条件类型、映射类型、工具类型等，掌握这些技巧后，你会发现 TypeScript 不仅仅是 JavaScript 的超集，更是一个强大的类型编程语言。"
---

## TypeScript 类型系统简介

TypeScript 的类型系统是图灵完备的，这意味着你可以用类型来编程！让我们从基础开始，逐步探索高级特性。

## 基础类型回顾

```typescript
// 基本类型
let name: string = "Alice";
let age: number = 25;
let isStudent: boolean = true;

// 数组
let scores: number[] = [90, 85, 88];
let names: Array<string> = ["Alice", "Bob"];

// 元组
let person: [string, number] = ["Alice", 25];

// 枚举
enum Color {
  Red,
  Green,
  Blue,
}
```

## 高级类型特性

### 1. 联合类型和交叉类型

**联合类型**：值可以是多种类型之一

```typescript
type Status = "pending" | "success" | "error";
type ID = string | number;

function printId(id: ID) {
  console.log(id);
}
```

**交叉类型**：组合多个类型

```typescript
interface Person {
  name: string;
}

interface Employee {
  employeeId: number;
}

type Staff = Person & Employee;

const alice: Staff = {
  name: "Alice",
  employeeId: 12345,
};
```

### 2. 类型守卫

使用类型守卫来缩小类型范围：

```typescript
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function process(value: string | number) {
  if (isString(value)) {
    // 这里 value 的类型是 string
    console.log(value.toUpperCase());
  } else {
    // 这里 value 的类型是 number
    console.log(value.toFixed(2));
  }
}
```

### 3. 泛型

泛型让类型更加灵活和可复用：

```typescript
// 泛型函数
function identity<T>(arg: T): T {
  return arg;
}

// 泛型接口
interface Box<T> {
  value: T;
}

const stringBox: Box<string> = { value: "hello" };
const numberBox: Box<number> = { value: 42 };

// 泛型约束
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): void {
  console.log(arg.length);
}
```

### 4. 条件类型

根据条件选择不同的类型：

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

// 实用例子：提取函数返回类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { name: "Alice", age: 25 };
}

type User = ReturnType<typeof getUser>; // { name: string; age: number; }
```

### 5. 映射类型

基于现有类型创建新类型：

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type ReadonlyTodo = Readonly<Todo>;
type PartialTodo = Partial<Todo>;
```

## 实战：构建类型安全的 API 客户端

让我们用学到的知识构建一个类型安全的 API 客户端：

```typescript
// 定义 API 端点
interface ApiEndpoints {
  "/users": {
    GET: { response: User[] };
    POST: { body: CreateUserDto; response: User };
  };
  "/users/:id": {
    GET: { response: User };
    PUT: { body: UpdateUserDto; response: User };
    DELETE: { response: void };
  };
}

// 提取路径
type Path = keyof ApiEndpoints;

// 提取方法
type Method<P extends Path> = keyof ApiEndpoints[P];

// 提取请求体
type RequestBody<P extends Path, M extends Method<P>> =
  ApiEndpoints[P][M] extends { body: infer B } ? B : never;

// 提取响应
type Response<P extends Path, M extends Method<P>> =
  ApiEndpoints[P][M] extends { response: infer R } ? R : never;

// 类型安全的 fetch 函数
async function api<P extends Path, M extends Method<P>>(
  path: P,
  method: M,
  body?: RequestBody<P, M>
): Promise<Response<P, M>> {
  const res = await fetch(path, {
    method: method as string,
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

// 使用
const users = await api("/users", "GET"); // User[]
const newUser = await api("/users", "POST", {
  name: "Alice",
  email: "alice@example.com"
}); // User
```

## 工具类型

TypeScript 内置了许多实用的工具类型：

```typescript
// Pick：选择部分属性
type UserPreview = Pick<User, "id" | "name">;

// Omit：排除部分属性
type UserWithoutPassword = Omit<User, "password">;

// Record：构造对象类型
type PageInfo = Record<"home" | "about" | "contact", { title: string }>;

// Exclude：从联合类型中排除
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"

// Extract：从联合类型中提取
type T1 = Extract<"a" | "b" | "c", "a" | "f">; // "a"

// NonNullable：排除 null 和 undefined
type T2 = NonNullable<string | number | undefined>; // string | number
```

## 最佳实践

### 1. 优先使用 interface 而非 type

```typescript
// ✅ 推荐
interface User {
  name: string;
  age: number;
}

// ⚠️ 仅在需要联合或交叉类型时使用 type
type ID = string | number;
```

### 2. 使用严格模式

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true
  }
}
```

### 3. 避免使用 any

```typescript
// ❌ 不推荐
function process(data: any) {
  // ...
}

// ✅ 推荐
function process<T>(data: T) {
  // ...
}

// 或使用 unknown
function process(data: unknown) {
  if (typeof data === "string") {
    // 类型守卫后可以安全使用
  }
}
```

## 调试技巧

### 查看推断的类型

```typescript
type Debug<T> = { [K in keyof T]: T[K] };

type User = Debug<{
  name: string;
  age: number;
}>;
```

### 使用 TypeScript Playground

访问 [TypeScript Playground](https://www.typescriptlang.org/play) 快速测试类型。

## 总结

TypeScript 的类型系统是一个强大的工具，掌握高级类型特性能让你：

- 写出更安全的代码
- 获得更好的 IDE 支持
- 减少运行时错误
- 提高代码可维护性

不要害怕类型体操！多练习，你会发现类型编程其实很有趣。

## 推荐资源

- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)
- [Type Challenges](https://github.com/type-challenges/type-challenges)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
