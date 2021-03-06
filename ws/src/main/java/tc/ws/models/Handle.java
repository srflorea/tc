package tc.ws.models;

import java.sql.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.OneToMany;
import javax.persistence.FetchType;

@Entity
@Table(name = "handle")
public class Handle {

	public enum Fields {
		HANDLE("handle"),
		COUNTRY("country"),
		MEMBER_SINCE("memberSince"),
		QUOTE("quote"),
		OVERALL_EARNING("overallEarning"),
		RELIABILITY_RATING("reliabilityRating"),
		HANDLE_RATINGS("handleRatings");

		private String name;

		private Fields(String name) {
			this.name = name;
		}

		public String getName() {
			return name;
		}
	}

	@Id
	@Column(name = "handle")
	private String handle;

	@Column(name = "country")
	private String country;

	@Column(name = "memberSince")
	private Date memberSince;

	@Column(name = "quote")
	private String quote;

	@Column(name = "overallEarning")
	private Long overallEarning;

	@Column(name = "reliability_rating")
	private Double reliabilityRating;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "handle")
	private List<HandleRating> handleRatings;

	public String getHandle() {
		return handle;
	}

	public void setHandle(String handle) {
		this.handle = handle;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public Date getMemberSince() {
		return memberSince;
	}

	public void setMemberSince(Date memberSince) {
		this.memberSince = memberSince;
	}

	public String getQuote() {
		return quote;
	}

	public void setQuote(String quote) {
		this.quote = quote;
	}

	public Long getOverallEarning() {
		return overallEarning;
	}

	public void setOverallEarning(Long overallEarning) {
		this.overallEarning = overallEarning;
	}

	public Double getReliabilityRating() {
		return reliabilityRating;
	}

	public void setReliabilityRating(Double reliabilityRating) {
		this.reliabilityRating = reliabilityRating;
	}

	public List<HandleRating> getHandleRatings() {
		return handleRatings;
	}

	public void setHandleRatings(List<HandleRating> handleRatings) {
		this.handleRatings = handleRatings;
	}
}
