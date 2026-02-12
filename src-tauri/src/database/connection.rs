use sqlx::sqlite::{SqlitePool, SqlitePoolOptions};
use tauri::Manager;

pub async fn init_database() -> Result<SqlitePool, sqlx::Error> {
    let app_data_dir = APP_HANDLE.get().unwrap().path()
        .app_data_dir()
        .expect("Could not determine app data directory");
    std::fs::create_dir_all(&app_data_dir)?;
    
    let db_path = app_data_dir.join("app.db");
    let db_url = format!("sqlite:{}", db_path.display());
        
    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await?;
    
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await?;
    
    Ok(pool)
}