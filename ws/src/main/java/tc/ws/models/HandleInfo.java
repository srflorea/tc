package tc.ws.models;

import java.util.Date;

public class HandleInfo {
	
	private String handle;
	private Double y;
	private Boolean submitted;
	private Date registrationDate;

	public String getHandle() {
		return handle;
	}
	public void setHandle(String handle) {
		this.handle = handle;
	}
	public Double getY() {
		return y;
	}
	public void setY(Double y) {
		this.y = y;
	}
	public Boolean getSubmitted() {
		return submitted;
	}
	public void setSubmitted(Boolean submitted) {
		this.submitted = submitted;
	}
	public Date getRegistrationDate() {
		return registrationDate;
	}
	public void setRegistrationDate(Date registrationDate) {
		this.registrationDate = registrationDate;
	}
}
