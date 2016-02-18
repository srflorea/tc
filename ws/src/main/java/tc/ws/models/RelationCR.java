package tc.ws.models;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "relation_c_r")
public class RelationCR {

	public enum Fields {
		HANDLE("id.handle"),
		CHALLENGE_ID("id.challengeId"),
		REGISTRATION_DATE("registrationDate"),
		SUBMISSION_DATe("submissionDate");

		private String name;

		private Fields(String name) {
			this.name = name;
		}

		public String getName() {
			return name;
		}
	}

	@EmbeddedId
	private Id id;

	@Column(name = "registrationDate")
	private Date registrationDate;

	@Column(name = "submissionDate")
	private Date submissionDate;
	
	public RelationCR() {}
	
	@Embeddable
	public static class Id implements Serializable {

		private static final long serialVersionUID = 1L;

		@Column(name = "handle")
		protected String handle;

		@Column(name = "challengeId")
		protected Long challengeId;

		public Id() {}

		public Id(String handle, Long challengeId) {
			this.handle = handle;
			this.challengeId = challengeId;
		}

		public String getHandle() {
			return handle;
		}

		public void setHandle(String handle) {
			this.handle = handle;
		}

		public Long getChallengeId() {
			return challengeId;
		}

		public void setChallengeId(Long challengeId) {
			this.challengeId = challengeId;
		}
	}

	public Date getRegistrationDate() {
		return registrationDate;
	}

	public void setRegistrationDate(Date registrationDate) {
		this.registrationDate = registrationDate;
	}

	public Date getSubmissionDate() {
		return submissionDate;
	}

	public void setSubmissionDate(Date submissionDate) {
		this.submissionDate = submissionDate;
	}
	
	public Id getId() {
		return id;
	}
	
	public void setId(Id id) {
		this.id = id;
	}
}
