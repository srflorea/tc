package tc.ws.utils;

public class Queries {

	public static final String SELECT_REGISTRATIONS_QUERY =
			"	select " +
			"	date(relation_c_r.registrationDate) date,	" +
			"	challenge.totalPrize prize,					" +
			"    case 										" +
			"		when challenge.challengeType = \"Code\"	" +
			"			then \"Code\"							" +
			"		when challenge.challengeType = \"UI Prototype Competition\"	" +
			"			then \"UI Prototype Competition\"							" +
			"		when challenge.challengeType = \"Assembly Competition\"			" +
			"			then \"Assembly Competition\"								" +
			"		when (challenge.challengeType = \"Specification\" or challenge.challengeType = \"Design\" or challenge.challengeType = \"Conceptualization\") " +
			"			then \"Design\"	" +
			"		when (challenge.challengeType = \"Test Suites\" or challenge.challengeType = \"Test Scenarios\") "+
			"			then \"testing\" " +
			"		when challenge.challengeType = \"First2Finish\" " +
			"			then \"First2Finish\" " +
			"		else challenge.challengeType " +
			"	end as type, " +
			"   relation_c_r.submissionDate != 0 as submitted, " +
			"	challenge.projectId as projectId					" +
			"from relation_c_r " +
			"join challenge " +
			"	on relation_c_r.challengeId = challenge.challengeId " +
			"where handle = :handle " + // \"savon_cn\" " +
			"order by date; ";
		
		public static final String SELECT_HANDLES_RATINGS =
			"	select 														" +
			"	relation_c_r.handle,										" +
			"	avg(handle_rating.rating) as y,								" +
			"    relation_c_r.submissionDate != 0 as submitted				" +
			"	from relation_c_r 											" +
			"	left join handle_rating										" +
			"		on relation_c_r.handle = handle_rating.handle			" +
			"	where relation_c_r.challengeId = :challengeId				" +
			"	group by relation_c_r.handle								" +
			"	order by registrationDate;									";

		public static final String SELECT_HANDLES_REL_RATINGS =
				"	select 													" +
				"		relation_c_r.handle,								" +
				"		handle.reliability_rating as y,						" +
				"    	relation_c_r.submissionDate != 0 as submitted		" +
				"	from relation_c_r 										" +
				"	left join handle										" +
				"		on relation_c_r.handle = handle.handle				" +
				"	where relation_c_r.challengeId = :challengeId			" +
				"	order by registrationDate;								";

		public static final String SELECT_HANDLES_NO_OF_REG =
				"	select													" +
				"		relation_c_r.handle,								" +
				"		count(*) as y,										" +
			    "		relation_c_r.submissionDate != 0 as submitted		" +
				"	from challenge											" +
				"	join relation_c_r										" +
				"		on challenge.challengeId = relation_c_r.challengeId	" +
				"	where relation_c_r.handle in							" +
			    "	(														" +
				"		select												" +
				"			handle											" +
				"		from relation_c_r									" +
				"		where relation_c_r.challengeId = :challengeId		" +
			    "	)														" +
				"	group by relation_c_r.handle							" +
				"	order by registrationDate;								";

		public static final String SELECT_HANDLES_NO_OF_SUB =
				"	select													" +
				"		relation_c_r.handle,								" +
				"		sum(if(relation_c_r.submissionDate != 0, 1, 0)) as y, " +
			    "		relation_c_r.submissionDate != 0 as submitted		" +
				"	from challenge											" +
				"	join relation_c_r										" +
				"		on challenge.challengeId = relation_c_r.challengeId	" +
				"	where relation_c_r.handle in							" +
			    "	(														" +
				"		select												" +
				"			handle											" +
				"		from relation_c_r									" +
				"		where relation_c_r.challengeId = :challengeId		" +
			    "	)														" +
				"	group by relation_c_r.handle							" +
				"	order by registrationDate;								";
}
