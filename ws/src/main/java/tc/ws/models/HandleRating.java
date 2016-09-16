package tc.ws.models;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Id;
import javax.persistence.Column;
import javax.persistence.ManyToOne;
import javax.persistence.JoinColumn;

@Entity
@Table(name = "handle_rating")
public class HandleRating {

	public enum Fields {
		HANDLE("handle"),
		NAME("name"),
		RATING("rating");

		private String name;

		private Fields(String name) {
			this.name = name;
		}

		public String getName() {
			return name;
		}
	}

	@Id
	@Column(name = "name")
	private String name;

	@Column(name = "rating")
	private int rating;

	@ManyToOne
	@JoinColumn(name="handle")
	private Handle handle;


	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getRating() {
		return rating;
	}

	public void setRating(int rating) {
		this.rating = rating;
	}

	public void setHandle(Handle handle) {
		this.handle = handle;
	}
}
