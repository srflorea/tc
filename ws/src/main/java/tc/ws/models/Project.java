package tc.ws.models;

public class Project {

	private Long projectId;
	private int noOfTasks;
	private int tasksCompleted;
	private int tasksCancelled;
	private int daysDuration;
	private Long avgAward;
	private int avgSubmissions;
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
}
