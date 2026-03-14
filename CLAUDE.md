## Project Overview

Components are the product. CLI is the installer. Website is for showcase.

Read README.md for structure and usage.

## Rules

- No CSS imports in component `.tsx` files (CSS is concatenated at install time)
- No barrel exports (`index.ts`) inside `soluid/`
- Registry categories are `"core"` and `"components"` only


## localhub ワークフロー

### 基本ルール
- Issue/Review の操作は `lh` コマンドを使う。`.localhub/` 内のファイルを直接読み書きしない
- `lh` コマンドの出力を読んで、次のアクションを判断する
- `git push` はユーザーの明示的な指示がある場合のみ

### Issue フロー
1. `lh issue create "タイトル" --body "説明"` で Issue 作成 + ブランチ切り替え
2. 修正作業
3. `lh review start --issue N` でレビュー開始
4. レビュー結果を確認
5. ユーザーの指示で `lh issue close N`

### 自律作業サイクル
1. `lh issue list` で未着手の issue を確認
2. issue を選んで `lh issue show <id>` で内容把握
3. 実装 → テスト → `lh review start --issue N`
4. レビュー OK なら `lh issue close N`
5. 3回行き詰まったら `lh issue block <id> "理由"` → 次の issue へ
6. 進捗は `lh issue comment <id> "状況"` で記録

### レビューフロー
1. `lh review start` でレビュー開始 (diff 保存)
2. `lh review add <id> security "指摘内容"` で各視点の指摘を追加
3. `lh review verdict <id> approve` で完了

### メモリ
- 学んだパターンは `lh memory add "パターン" --context "文脈"` で記録
- タスク開始前に `lh memory search "キーワード"` で過去のパターンを確認
