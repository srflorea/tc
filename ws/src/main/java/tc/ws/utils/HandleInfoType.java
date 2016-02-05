package tc.ws.utils;

public enum HandleInfoType {

	RATING(1),
	REL_RATING(2),
	NO_OF_REG(3),
	NO_OF_SUB(4);

	private HandleInfoType(int id) {
		this.id = id;
	}

	private final int id;

	public int getId() {
		return id;
	}
}
