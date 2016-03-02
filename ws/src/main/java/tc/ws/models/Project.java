package tc.ws.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class Project {

	private Long projectId;
	private int noOfTasks;
	private int tasksCompleted;
	private int tasksCancelled;

	@JsonIgnore
	private String technologies;

	private int daysDuration;
	private Long avgAward;
	private int avgSubmissions;
	
	private List<String> techsList;
	
	public Long getProjectId() {
		return projectId;
	}
	public void setProjectId(Long projectId) {
		this.projectId = projectId;
	}
	public int getNoOfTasks() {
		return noOfTasks;
	}
	public void setNoOfTasks(int noOfTasks) {
		this.noOfTasks = noOfTasks;
	}
	public int getTasksCompleted() {
		return tasksCompleted;
	}
	public void setTasksCompleted(int tasksCompleted) {
		this.tasksCompleted = tasksCompleted;
	}
	public int getTasksCancelled() {
		return tasksCancelled;
	}
	public void setTasksCancelled(int tasksCancelled) {
		this.tasksCancelled = tasksCancelled;
	}
	public int getDaysDuration() {
		return daysDuration;
	}
	public void setDaysDuration(int daysDuration) {
		this.daysDuration = daysDuration;
	}
	public Long getAvgAward() {
		return avgAward;
	}
	public void setAvgAward(Long avgAward) {
		this.avgAward = avgAward;
	}
	public int getAvgSubmissions() {
		return avgSubmissions;
	}
	public void setAvgSubmissions(int avgSubmissions) {
		this.avgSubmissions = avgSubmissions;
	}
	public String getTechnologies() {
		return technologies;
	}
	public void setTechnologies(String technologies) {
		this.technologies = technologies;
	}
	public List<String> getTechsList() {
		return techsList;
	}
	public void setTechsList(List<String> techsList) {
		this.techsList = techsList;
	}
}
