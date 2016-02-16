package tc.ws.models;

import java.util.Date;

public class ChallengeRegistration {

	private Long challengeId;
	private String challengeName;
	private String status;
	private Long prize;
	private int daysLength;
	private Date registrationStart;
	private Date registrationEnd;
	private Date registrationDate;
	private int noOfRegistrations;

	public Long getChallengeId() {
		return challengeId;
	}
	public void setChallengeId(Long challengeId) {
		this.challengeId = challengeId;
	}
	public String getChallengeName() {
		return challengeName;
	}
	public void setChallengeName(String challengeName) {
		this.challengeName = challengeName;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public Long getPrize() {
		return prize;
	}
	public void setPrize(Long prize) {
		this.prize = prize;
	}
	public int getDaysLength() {
		return daysLength;
	}
	public void setDaysLength(int daysLength) {
		this.daysLength = daysLength;
	}
	public Date getRegistrationStart() {
		return registrationStart;
	}
	public void setRegistrationStart(Date registrationStart) {
		this.registrationStart = registrationStart;
	}
	public Date getRegistrationEnd() {
		return registrationEnd;
	}
	public void setRegistrationEnd(Date registrationEnd) {
		this.registrationEnd = registrationEnd;
	}
	public Date getRegistrationDate() {
		return registrationDate;
	}
	public void setRegistrationDate(Date registrationDate) {
		this.registrationDate = registrationDate;
	}
	public int getNoOfRegistrations() {
		return noOfRegistrations;
	}
	public void setNoOfRegistrations(int noOfRegistrations) {
		this.noOfRegistrations = noOfRegistrations;
	}
}
