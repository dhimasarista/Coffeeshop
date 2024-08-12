# Payment Using Midtrans & SocketIO

### Tech-Stack

Runtime: NodeJS


### DB Design

```
Table users {
  id char(36)
  username varchar(50)
  is_admin bool
  is_active bool
  timestamps date
}

Table products {
  id char(36)
  name varchar(50)
  price bigint
  timestamps date
}

Table orders {
  id char(36)
  anon_id char(36)
  status text
  total_amount bigint
  transaction_token text
  timestamps date
}

Table order_items {
  id char(36)
  order_id char(36) [ref: > orders.id]
  product_id char(36) [ref: > products.id]
  quantity int
  amount bigint
  timestamps date
}

```
