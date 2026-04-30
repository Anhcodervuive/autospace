# Giai thich viec cap nhat dependency trong `libs/*`

Tai lieu nay giai thich vi sao can cap nhat cac file `package.json` trong thu muc `libs` va quy tac de duy tri chung ve sau.

## Van de truoc khi sua

Truoc khi cap nhat, mot so package trong `libs/*` gap cac van de sau:

- Quan he giua cac workspace package chua duoc khai bao ro rang.
- Thu vien duoc import truc tiep trong source code nhung lai khong nam trong `dependencies`.
- Mot so package runtime bi dat vao `devDependencies`.
- Mot so package chi dung cho tooling, types hoac codegen lai bi dat nham vao `dependencies`.
- Mot so package duoc ky vong "tu app se co san" do co che hoist, dan den manifest khong phan anh dung nhu cau that.

Nhung van de nay thuong gay ra:

- Kho hieu package nao thuc su phu thuoc package nao.
- Cai dat khong on dinh giua cac app va libs.
- Phat sinh loi type hoac loi resolve module.
- Kho tach lib ra tai su dung hoac publish trong tuong lai.

## Nguyen tac duoc ap dung

Khi sua `package.json` trong `libs/*`, minh dung cac quy tac sau:

### 1. `dependencies` dung cho dependency runtime

Neu source code trong lib `import` truc tiep mot package va package do can khi chay app, thi package do phai nam trong `dependencies`.

Vi du:

- `@autospace/ui` import truc tiep tu `@autospace/forms`, `@autospace/network`, `@autospace/util`
- `@autospace/network` dung `@apollo/client`, `graphql`, `next-auth`
- `@autospace/util` dung `date-fns`, `pluralize`

Nhung package nay can duoc khai bao ro rang trong `dependencies`.

### 2. `devDependencies` dung cho tooling

Neu package chi phuc vu viec phat trien, generate code, lint, type helper, hoac build script thi no phai nam trong `devDependencies`.

Vi du:

- `@graphql-codegen/*`
- `@types/*`
- eslint
- cac package chi dung cho codegen

Muc tieu la tranh dua nham tooling vao runtime.

### 3. Internal package phai khai bao bang `workspace:*`

Day la monorepo, nen khi mot lib dung mot lib khac trong cung workspace, quan he do nen duoc viet ro bang:

- `@autospace/forms`: `workspace:*`
- `@autospace/network`: `workspace:*`
- `@autospace/ui`: `workspace:*`
- `@autospace/util`: `workspace:*`

Lam vay de:

- Manifest the hien dung quan he giua cac package
- Yarn/Nx hieu ro graph dependency
- Giam phu thuoc vao hoisting ngau nhien

## Tai sao khong nen "de app cai dum"

Trong monorepo, co the app A da cai `react-hook-form`, `next-auth`, hoac `graphql`, va lib B vo tinh van chay du khong khai bao gi. Cach nay co van de:

- Lib B khong tu mo ta dung nhu cau cua no
- Khi app khac dung lai lib B, co the bi thieu package
- De sinh ra nhieu ban copy type khac nhau
- Kho debug vi code chay duoc o noi nay nhung hong o noi khac

Noi ngan gon: neu lib dung package nao trong runtime, lib do nen tu khai bao package ay.

## Cac thay doi da duoc ap dung

### `libs/forms/package.json`

- Khai bao ro `@autospace/network` va `@autospace/util` bang `workspace:*`
- Dua `@hookform/resolvers`, `react-hook-form`, `zod`, `react` vao `dependencies`

Ly do:

- `forms` import truc tiep cac package nay trong source code
- Day la dependency runtime cua form logic, khong phai tooling

### `libs/network/package.json`

- Giu codegen packages trong `devDependencies`
- Dua `@apollo/client`, `@graphql-typed-document-node/core`, `graphql`, `jsonwebtoken`, `next`, `next-auth`, `react`, `react-dom`, `rxjs` vao `dependencies`

Ly do:

- `network` co code runtime dung Apollo, GraphQL fetch, auth config, va React provider
- Nhung package do can ton tai khi code thuc su duoc thuc thi

### `libs/ui/package.json`

- Khai bao ro dependency noi bo: `@autospace/forms`, `@autospace/network`, `@autospace/util`
- Dua cac package UI/runtime vao `dependencies`
- Giu cac package type va lint trong `devDependencies`

Ly do:

- `ui` dang la lib dung truc tiep forms, network, util, Next, React, MUI, Headless UI, map, toast...
- Neu khong khai bao ro, manifest se khong phan anh dung dependency that

### `libs/util/package.json`

- Dua `date-fns`, `pluralize`, `react-hook-form`, `next`, `react`, `react-dom` vao `dependencies`
- Giu `@types/pluralize` trong `devDependencies`

Ly do:

- `util` khong chi la utility thuan. No dang chua React hooks va Next-specific hook
- Vi vay no co dependency runtime that, khong the xem la package zero-dependency

## Mot thay doi nho trong code

Trong `libs/util/hooks/price.tsx`, import `FormTypeBookSlot` duoc doi sang `import type`.

Ly do:

- Day chi la type dependency
- Giup the hien ro day khong phai runtime import
- Lam graph phu thuoc de doc hon

## Quy tac de team tiep tuc ap dung

Khi them hoac sua code trong `libs/*`, co the theo checklist sau:

1. Neu vua them `import` moi vao runtime code, kiem tra lai `dependencies`.
2. Neu package chi dung cho lint, types, codegen, script, dua vao `devDependencies`.
3. Neu lib A dung lib B trong cung monorepo, dung `workspace:*`.
4. Khong dua dependency vao `peerDependencies` neu workspace nay van can package do de chay on dinh noi bo, tru khi co ly do ro rang.
5. Khong dua package vao manifest chi vi "co the sau nay can". Chi khai bao thu gi code dang dung that.

## Ket luan

Muc tieu cua lan cap nhat nay khong phai chi de "dep package.json", ma de:

- Mo ta ro dependency graph trong monorepo
- Giam loi do hoisting va resolution
- Giup moi lib tu chiu trach nhiem ve nhu cau runtime cua no
- Lam workspace de maintain, debug, va mo rong hon

Neu can, co the tach them mot tai lieu nua ve:

- Khi nao dung `dependencies` / `devDependencies` / `peerDependencies`
- Cach xu ly package cho React/Next shared library trong monorepo
