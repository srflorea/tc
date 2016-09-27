package tc.ws.models;

import java.util.Date;

public class Registration {

	private Date date;
	private long prize;
	private String type;
	private int submitted;
	private String challangeName;
	private int projectId;
	private int challengeId;
	private Date registrationStartDate;
	private Date submissionEndDate;

	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}

	public long getPrize() {
		return prize;
	}
	public void setPrize(long prize) {
		this.prize = prize;
	}

	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}

	public int getSubmitted() {
		return submitted;
	}
	public void setSubmitted(int submitted) {
		this.submitted = submitted;
	}

	public String getChallengeName() {
		return challangeName;
	}
	public void setChallengeName(String challangeName) {
		this.challangeName = challangeName;
	}

	public int getProjectId() {
		return projectId;
	}
	public void setProjectId(int projectId) {
		this.projectId = projectId;
	}

	public int getChallengeId() {
		return challengeId;
	}
	public void setChallengeId(int challengeId) {
		this.challengeId = challengeId;
	}

	public Date getRegistrationStartDate() {
		return registrationStartDate;
	}
	public void setRegistrationStartDate(Date registrationStartDate) {
		this.registrationStartDate = registrationStartDate;
	}

	public Date getSubmissionEndDate() {
		return submissionEndDate;
	}
	public void setSubmissionEndDate(Date submissionEndDate) {
		this.submissionEndDate = submissionEndDate;
	}
}
