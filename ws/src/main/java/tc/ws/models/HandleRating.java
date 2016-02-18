package tc.ws.models;

import javax.persistence.Entity;
import javax.persistence.Table;

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
}
