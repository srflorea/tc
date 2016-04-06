package tc.ws.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "challenge")
public class Challenge {

	public enum Fields {
		CHALLENGE_ID("challengeId"),
		CHALLENGE_NAME("challengeName"),
		PROJECT_ID("projectId"),
		PLATFORMS("platforms"),
		TECHNOLOGIES("technologies");

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
}
