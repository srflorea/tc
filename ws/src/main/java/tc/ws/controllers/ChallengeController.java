package tc.ws.controllers;

import java.util.List;

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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import tc.ws.models.Challenge;
import tc.ws.models.Handle;
import tc.ws.models.Registration;
import tc.ws.utils.HandleInfoType;
import tc.ws.utils.HibernateUtils;
import tc.ws.utils.Queries;

@RestController
public class ChallengeController {
	
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

	@CrossOrigin
	@RequestMapping("/registrations")
	public List<Registration> registrations(@RequestParam(value="handle") String handle) {

		Session session = HibernateUtils.getSessionFactory().openSession();
		session.beginTransaction();

		SQLQuery query = session.createSQLQuery(Queries.SELECT_REGISTRATIONS_QUERY);
		query.addScalar("date", DateType.INSTANCE);
		query.addScalar("prize", LongType.INSTANCE);
		query.addScalar("type", StringType.INSTANCE);
		query.addScalar("submitted", IntegerType.INSTANCE);
		query.setString("handle", handle);
		query.setResultTransformer(Transformers.aliasToBean(Registration.class));
		@SuppressWarnings("unchecked")
		List<Registration> list = query.list();
	
		return list;
	}

	@CrossOrigin
	@RequestMapping("/handles/info")
	public List<Handle> handles(@RequestParam Long challengeId, @RequestParam Long type) {
		
		String queryString = Queries.SELECT_HANDLES_RATINGS;
		if (type == HandleInfoType.RATING.getId()) {
			queryString = Queries.SELECT_HANDLES_RATINGS;
		} else if (type == HandleInfoType.REL_RATING.getId()) {
			queryString = Queries.SELECT_HANDLES_REL_RATINGS;
		} else if (type == HandleInfoType.NO_OF_REG.getId()) {
			queryString = Queries.SELECT_HANDLES_NO_OF_REG;
		} else if (type == HandleInfoType.NO_OF_SUB.getId()) {
			queryString = Queries.SELECT_HANDLES_NO_OF_SUB;
		}

		Session session = HibernateUtils.getSessionFactory().openSession();
		session.beginTransaction();

		SQLQuery query = session.createSQLQuery(queryString);
		query.addScalar("handle", StringType.INSTANCE);
		query.addScalar("y", DoubleType.INSTANCE);
		query.addScalar("submitted", IntegerType.INSTANCE);
		query.setLong("challengeId", challengeId);
		query.setResultTransformer(Transformers.aliasToBean(Handle.class));
		@SuppressWarnings("unchecked")
		List<Handle> list = query.list();
	
		return list;
	}
}
