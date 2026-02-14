use crate::database::models::project::Project;
use crate::{models::dbstate::DbState, services::project_service};
use tauri::State;

#[tauri::command]
pub async fn create_project(
    name: String,
    description: String,
    color: String,
    db: State<'_, DbState>,
) -> Result<(), String> {
    project_service::create_project(name, description, color, db)
        .await
        .expect("Unable to create project");
    Ok(())
}

#[tauri::command]
pub async fn get_projects(db: State<'_, DbState>) -> Result<Vec<Project>, String> {
    let projects = project_service::get_projects(db)
        .await
        .expect("Unable to get projects");
    Ok(projects)
}

#[tauri::command]
pub async fn delete_project(id: i64, db: State<'_, DbState>) -> Result<(), String> {
    project_service::delete_project(id, db)
        .await
        .expect("Cannot delete project");
    Ok(())
}
