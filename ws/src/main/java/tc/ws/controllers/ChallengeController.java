package tc.ws.controllers;

import java.util.List;

import javax.persistence.EntityManager;

import org.hibernate.Criteria;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.IntegerType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import tc.ws.models.Challenge;
import tc.ws.models.Handle;
import tc.ws.models.Registration;
import tc.ws.utils.HibernateUtils;

@RestController
public class ChallengeController {

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
		"	select 														" +
		"	relation_c_r.handle,										" +
		"	avg(handle_rating.rating) as y,								" +
		"    relation_c_r.submissionDate != 0 as submitted				" +
		"	from relation_c_r 											" +
		"	join handle_rating											" +
		"		on relation_c_r.handle = handle_rating.handle			" +
		"	where relation_c_r.challengeId = 30048038					" +
		"	group by relation_c_r.handle								" +
		"	order by registrationDate;									";
	
	@SuppressWarnings("unchecked")
	@RequestMapping("/challenges")
	public List<Challenge> challenges(@RequestParam Long projectId) {
		
		Session session = HibernateUtils.getSessionFactory().openSession();
		session.beginTransaction();

		Criteria criteria = session.createCriteria(Challenge.class);
		criteria.add(Restrictions.eq(Challenge.Fields.PROJECT_ID.getName(), projectId));
		List<Challenge> challenges = criteria.list();

		return challenges;
	}
	
	@RequestMapping("/registrations")
	public List<Registration> registrations(@RequestParam(value="handle") String handle) {

		Session session = HibernateUtils.getSessionFactory().openSession();
		session.beginTransaction();

		SQLQuery query = session.createSQLQuery(SELECT_REGISTRATIONS_QUERY);
		query.addScalar("date", DateType.INSTANCE);
		query.addScalar("prize", LongType.INSTANCE);
		query.addScalar("type", StringType.INSTANCE);
		query.addScalar("submitted", IntegerType.INSTANCE);
		query.setString("handle", handle);
		query.setResultTransformer(Transformers.aliasToBean(Registration.class));
		List<Registration> list = query.list();
	
		return list;
	}
	
	@RequestMapping("/handles/ratings")
	public List<Handle> handles(@RequestParam Long challengeId) {
		
		Session session = HibernateUtils.getSessionFactory().openSession();
		session.beginTransaction();

		SQLQuery query = session.createSQLQuery(SELECT_HANDLES_RATINGS);
		query.addScalar("handle", StringType.INSTANCE);
		query.addScalar("y", DoubleType.INSTANCE);
		query.addScalar("submitted", IntegerType.INSTANCE);
		//query.setLong("challengeId", challengeId);
		query.setResultTransformer(Transformers.aliasToBean(Handle.class));
		List<Handle> list = query.list();
	
		return list;
	}
}
