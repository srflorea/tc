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
			"   relation_c_r.submissionDate != 0 as submitted " +
			"from relation_c_r " +
			"join challenge " +
			"	on relation_c_r.challengeId = challenge.challengeId " +
			"where handle = :handle " + // \"savon_cn\" " +
			"order by date; ";
		
		public static final String SELECT_HANDLES_RATINGS =
				"	select 													" +
				"		relation_c_r.handle,								" +
				"		avg(handle_rating.rating) as y,						" +
				"   	relation_c_r.submissionDate != 0 as submitted,		" +
				"		relation_c_r.registrationDate						" +
				"	from relation_c_r 										" +
				"	left join handle_rating									" +
				"		on relation_c_r.handle = handle_rating.handle		" +
				"	where relation_c_r.challengeId = :challengeId			" +
				"	group by relation_c_r.handle							";

		public static final String SELECT_HANDLES_REL_RATINGS =
				"	select 													" +
				"		relation_c_r.handle,								" +
				"		handle.reliability_rating as y,						" +
				"    	relation_c_r.submissionDate != 0 as submitted,		" +
				"		relation_c_r.registrationDate						" +
				"	from relation_c_r 										" +
				"	left join handle										" +
				"		on relation_c_r.handle = handle.handle				" +
				"	where relation_c_r.challengeId = :challengeId			";

		public static final String SELECT_HANDLES_NO_OF_REG =
				"	select													" +
				"		relation_c_r.handle,								" +
				"		count(*) as y,										" +
			    "		relation_c_r.submissionDate != 0 as submitted,		" + //not working... is changed later during the flow
				"		relation_c_r.registrationDate						" + //not working... is changed later during the flow
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
				"	group by relation_c_r.handle							";

		public static final String SELECT_HANDLES_NO_OF_SUB =
				"	select													" +
				"		relation_c_r.handle,								" +
				"		sum(if(relation_c_r.submissionDate != 0, 1, 0)) as y, " +
			    "		relation_c_r.submissionDate != 0 as submitted,		" + //not working... is changed later during the flow
				"		relation_c_r.registrationDate						" + //not working... is changed later during the flow
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
				"	group by relation_c_r.handle							";

		public static final String SELECT_PROJECT_CHALLENGES_QUERY =
				"	select													" +
				"		relation_c_r.challengeId as challengeId,			" +
			    "		challengeName as challengeName,						" +
			    "		status,												" +
			    "		totalPrize as prize,								" +
			    "		datediff(registrationEndDate, registrationStartDate) + 1 as daysLength, " +
			    "		date(registrationStartDate) as registrationStart,	" +
			    "		date(registrationEndDate) as registrationEnd,		" +
			    "		date(registrationDate) as registrationDate,			" +
			    "		count(*) as noOfRegistrations						" +
				"	from relation_c_r										" +
				"	join challenge											" +
				"		on relation_c_r.challengeId = challenge.challengeId " +
				"	where projectId = :projectId							" +
				"	group by challengeId, registrationDate;					";

		public static final String SELECT_MATRIX_CHALLENGES_QUERY =
				"	select													" +
				"		relation_c_r.challengeId as challengeId,			" +
			    "		challengeName as challengeName,						" +
			    "		status,												" +
			    "		totalPrize as prize,								" +
			    "		datediff(registrationEndDate, registrationStartDate) + 1 as daysLength, " +
			    "		date(registrationStartDate) as registrationStart,	" +
			    "		date(registrationEndDate) as registrationEnd,		" +
			    "		date(registrationDate) as registrationDate,			" +
			    "		count(*) as noOfRegistrations						" +
				"	from relation_c_r										" +
				"	join challenge											" +
				"		on relation_c_r.challengeId = challenge.challengeId " +
				"	where technologies like :technology						" +
				"		and platforms like :platform						" +
				"	group by challengeId, registrationDate;					";

		public static final String SELECT_PROJECTS_QUERY =
				"	select																				" +
				"		projectId projectId,															" +
				"		count(*) noOfTasks,																" +
			    "		sum(if(status = 'Completed', 1, 0)) tasksCompleted,								" +
			    "		sum(if(status <> 'Completed', 1, 0)) tasksCancelled,							" +
			    "		group_concat(technologies) technologies,										" +
			    "		group_concat(challengeType) challengesTypes,									" +
				"	    datediff(max(submissionEndDate), min(registrationStartDate)) daysDuration,		" +
				"	    avg(totalPrize) avgAward,														" +
				"	    avg(numSubmissions) avgSubmissions,												" +
				"	    avg(numRegistrants) avgRegistrants												" +
				"	from challenge																		" +
				"	group by projectId;																	";
}
