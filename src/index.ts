import { S3Client } from "bun";

const s3 = new S3Client({
  /**
   * 手動でエンドポイントの設定をしないとエラーになった
   * S3Error: an unexpected error has occurred
   *  code: "ConnectionRefused"
   * Bun v1.2.3 (macOS arm64)
   */
  endpoint: process.env.S3_ENDPOINT,
});

const main = async () => {
  const testFilePath = "dir/test.txt";

  // ファイルをアップロード
  await s3.write(testFilePath, "Hello, World!");

  // ファイルを取得
  const s3File = s3.file(testFilePath);

  // ファイルのメタデータ
  console.log(s3File);
  // ファイルの情報
  console.log(await s3File.stat());
  // 事前署名されたURL
  // URLを返すのではなく、Responseをそのまま返す事でリダイレクトさせられる
  // https://bun.sh/docs/api/s3#new-response-s3file
  console.log(s3File.presign());
  // ファイルの中身
  console.log(await s3File.text());
  // ファイルの存在確認
  console.log(await s3.exists(testFilePath));

  // ファイルを削除
  await s3File.delete();

  // 再度、ファイルの存在確認
  console.log(await s3.exists(testFilePath));
};

main();
