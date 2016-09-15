package tc.ws.models;

import java.sql.Date;

public class HandleInfo {
	
	private String handle;
	private Double regNo;
	private Double subNo;
	private Double rating;
	private Double relRating;
	private Boolean submitted;
	private Date registrationDate;

	public String getHandle() {
		return handle;
	}
	public void setHandle(String handle) {
		this.handle = handle;
	}

	public Double getRegNo() {
		return regNo;
	}
	public void setRegNo(Double regNo) {
		this.regNo = regNo;
	}

	public Double getSubNo() {
		return subNo;
	}
	public void setSubNo(Double subNo) {
		this.subNo = subNo;
	}

	public Double getRating() {
		return rating;
	}
	public void setRating(Double rating) {
		this.rating = rating;
	}

	public Double getRelRating() {
		return relRating;
	}
	public void setRelRating(Double relRating) {
		this.relRating = relRating;
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
