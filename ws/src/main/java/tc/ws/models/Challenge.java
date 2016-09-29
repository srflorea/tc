package tc.ws.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import java.sql.Date;

@Entity
@Table(name = "challenge")
public class Challenge {

	public enum Fields {
		CHALLENGE_ID("challengeId"),
		CHALLENGE_NAME("challengeName"),
		PROJECT_ID("projectId"),
		PLATFORMS("platforms"),
		TECHNOLOGIES("technologies"),
		NUM_REGISTRANTS("numRegistrants"),
		NUM_SUBMISSIONS("numSubmissions"),
		STATUS("status"),
		REGISTRATION_START_DATE("registrationStartDate"),
		SUBMISSION_END_DATE("submissionEndDate"),
		CHALLENGE_TYPE("challengeType"),
		PRIZE("prize");

		private String name;

		private Fields(String name) {
			this.name = name;
		}

		public String getName() {
			return name;
		}
	}

	@Id
	@Column(name = "challengeId")
	private long challengeId;

	@Column(name = "challengeName")
	private String challengeName;

	@Column(name = "projectId")
	private long projectId;

	@Column(name = "platforms")
	private String platforms;

	@Column(name = "technologies")
	private String technologies;

	@Column(name = "numRegistrants")
	private int numRegistrants;

	@Column(name = "numSubmissions")
	private int numSubmissions;

	@Column(name = "status")
	private String status;

	@Column(name = "registrationStartDate")
	private Date registrationStartDate;

	@Column(name = "submissionEndDate")
	private Date submissionEndDate;

	@Column(name = "challengeType")
	private String challengeType;

	@Column(name = "totalPrize")
	private int prize;


	public Challenge() {}

	public Challenge(long challengeId, String challengeName) {
		this.challengeId = challengeId;
		this.challengeName = challengeName;
	}

	public long getChallengeId() {
		return challengeId;
	}

	public String getChallengeName() {
		return challengeName;
	}

	public long getProjectId() {
		return projectId;
	}

	public String getPlatforms() {
		return platforms;
	}

	public String getTechnologies() {
		return technologies;
	}

	public int getNumRegistrants() {
		return numRegistrants;
	}

	public int getNumSubmissions() {
		return numSubmissions;
	}

	public String getStatus() {
		return status;
	}

	public Date getRegistrationStartDate() {
		return registrationStartDate;
	}

	public Date getSubmissionEndDate() {
		return submissionEndDate;
	}

	public String getChallengeType() {
		return challengeType;
	}

	public int getPrize() {
		return prize;
	}
}
