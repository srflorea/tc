package tc.ws.controllers;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.Criteria;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.hibernate.transform.Transformers;
import org.hibernate.type.BooleanType;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.IntegerType;
import org.hibernate.type.LongType;
import org.hibernate.type.StringType;
import org.hibernate.type.TimestampType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import tc.ws.models.Challenge;
import tc.ws.models.ChallengeRegistration;
import tc.ws.models.HandleInfo;
import tc.ws.models.Handle;
import tc.ws.models.Project;
import tc.ws.models.Registration;
import tc.ws.models.RelationCR;
import tc.ws.utils.HandleInfoType;
import tc.ws.utils.HibernateUtils;
import tc.ws.utils.Queries;

@CrossOrigin
@RestController
public class ChallengeController {
	
	@SuppressWarnings("unchecked")
	@RequestMapping("/challenges")
	public List<Challenge> challenges(@RequestParam(value = "challengeId", required=false) Long challengeId) {

		Session session = HibernateUtils.getSessionFactory().openSession();
		session.beginTransaction();

		Criteria criteria = session.createCriteria(Challenge.class);
		if (challengeId != null) {
			criteria.add(Restrictions.eq(Challenge.Fields.CHALLENGE_ID.getName(), challengeId));
		}

		List<Challenge> challenges = criteria.list();

		return challenges;
	}

	@SuppressWarnings("unchecked")
	@RequestMapping("/handles")
	public List<Handle> handles(@RequestParam(value = "handle", required=false) String handle) {

		Session session = HibernateUtils.getSessionFactory().openSession();
		session.beginTransaction();

		Criteria criteria = session.createCriteria(Handle.class);
		if (handle != null) {
			criteria.add(Restrictions.eq(Handle.Fields.HANDLE.getName(), handle));
		}

		List<Handle> handles = criteria.list();

		return handles;
	}

	@RequestMapping("/registrations")
	public List<Registration> registrations(@RequestParam(value="handle") String handle) {

		Session session = HibernateUtils.getSessionFactory().openSession();
		session.beginTransaction();

		SQLQuery query = session.createSQLQuery(Queries.SELECT_REGISTRATIONS_QUERY);
		query.addScalar("date", DateType.INSTANCE);
		query.addScalar("prize", LongType.INSTANCE);
		query.addScalar("type", StringType.INSTANCE);
		query.addScalar("submitted", IntegerType.INSTANCE);
		query.addScalar("challengeName", StringType.INSTANCE);
		query.addScalar("projectId", IntegerType.INSTANCE);
		query.addScalar("challengeId", IntegerType.INSTANCE);
		query.setString("handle", handle);
		query.setResultTransformer(Transformers.aliasToBean(Registration.class));
		@SuppressWarnings("unchecked")
		List<Registration> list = query.list();
	
		return list;
	}

	@RequestMapping("/handles/info")
	public List<HandleInfo> handles(@RequestParam Long challengeId) {
		
		String queryString = Queries.SELECT_HANDLES_RATINGS_AND_REL_RATINGS;
		
		Session session = HibernateUtils.getSessionFactory().openSession();
		session.beginTransaction();

		SQLQuery query = session.createSQLQuery(queryString);
		query.addScalar("handle", StringType.INSTANCE);
		query.addScalar("rating", DoubleType.INSTANCE);
		query.addScalar("relRating", DoubleType.INSTANCE);
		query.addScalar("submitted", BooleanType.INSTANCE);
		query.setLong("challengeId", challengeId);
		query.setResultTransformer(Transformers.aliasToBean(HandleInfo.class));
		@SuppressWarnings("unchecked")
		List<HandleInfo> list = query.list();

		Map<String, HandleInfo> handleInfoMap = new HashMap<>();
		for (HandleInfo handleInfo : list) {
			handleInfoMap.put(handleInfo.getHandle(), handleInfo);
		}


		Criteria criteria = session.createCriteria(RelationCR.class);
		//criteria.setProjection(Projections.property(RelationCR.Fields.HANDLE.getName()));
		criteria.add(Restrictions.eq(RelationCR.Fields.CHALLENGE_ID.getName(), challengeId));
		List<RelationCR> relations = criteria.list();

		Map<String, RelationCR> handlesMap = new HashMap<>();
		for (RelationCR relation : relations) {
			handlesMap.put(relation.getId().getHandle(), relation);
		}

		query = session.createSQLQuery(Queries.SELECT_HANDLES_NO_OF_REG_AND_SUB);
		query.addScalar("handle", StringType.INSTANCE);
		query.addScalar("regNo", DoubleType.INSTANCE);
		query.addScalar("subNo", DoubleType.INSTANCE);
		query.setLong("challengeId", challengeId);
		query.setResultTransformer(Transformers.aliasToBean(HandleInfo.class));
		@SuppressWarnings("unchecked")
		List<HandleInfo> handlesInfo = query.list();

		for (HandleInfo handleInfo : handlesInfo) {
			RelationCR relation = handlesMap.get(handleInfo.getHandle());
			handleInfo.setSubmitted(relation.getSubmissionDate() != null ? true : false);
			handleInfo.setRegistrationDate(relation.getRegistrationDate());

			handleInfo.setRating(handleInfoMap.get(handleInfo.getHandle()).getRating());
			handleInfo.setRelRating(handleInfoMap.get(handleInfo.getHandle()).getRelRating());
		}

		return handlesInfo;
	}

	@RequestMapping("/projectChallenges")
	public List<ChallengeRegistration> getProjectChallenges(@RequestParam Long projectId) {
		Session session = HibernateUtils.getSessionFactory().openSession();
		session.beginTransaction();

		SQLQuery query = session.createSQLQuery(Queries.SELECT_PROJECT_CHALLENGES_QUERY);
		query.addScalar("challengeId", LongType.INSTANCE);
		query.addScalar("challengeName", StringType.INSTANCE);
		query.addScalar("status", StringType.INSTANCE);
		query.addScalar("prize", LongType.INSTANCE);
		query.addScalar("daysLength", IntegerType.INSTANCE);
		query.addScalar("registrationStart", DateType.INSTANCE);
		query.addScalar("registrationEnd", DateType.INSTANCE);
		query.addScalar("registrationDate", DateType.INSTANCE);
		query.addScalar("registrationStart", DateType.INSTANCE);
		query.addScalar("noOfRegistrations", IntegerType.INSTANCE);
		query.setLong("projectId", projectId);
		query.setResultTransformer(Transformers.aliasToBean(ChallengeRegistration.class));

		@SuppressWarnings("unchecked")
		List<ChallengeRegistration> list = query.list();

		return list;
	}

	@RequestMapping("/matrixChallenges")
	public List<ChallengeRegistration> getMatrixChallenges(
			@RequestParam String platform,
			@RequestParam String technology) {
		Session session = HibernateUtils.getSessionFactory().openSession();
		session.beginTransaction();

		SQLQuery query = session.createSQLQuery(Queries.SELECT_MATRIX_CHALLENGES_QUERY);
		query.addScalar("challengeId", LongType.INSTANCE);
		query.addScalar("challengeName", StringType.INSTANCE);
		query.addScalar("status", StringType.INSTANCE);
		query.addScalar("prize", LongType.INSTANCE);
		query.addScalar("daysLength", IntegerType.INSTANCE);
		query.addScalar("registrationStart", DateType.INSTANCE);
		query.addScalar("registrationEnd", DateType.INSTANCE);
		query.addScalar("registrationDate", DateType.INSTANCE);
		query.addScalar("registrationStart", DateType.INSTANCE);
		query.addScalar("noOfRegistrations", IntegerType.INSTANCE);
		query.setString("platform", "%" + platform + "%");
		query.setString("technology", "%" + technology + "%");
		query.setResultTransformer(Transformers.aliasToBean(ChallengeRegistration.class));

		@SuppressWarnings("unchecked")
		List<ChallengeRegistration> list = query.list();

		return list;
	}

	@RequestMapping("/projects")
	public List<Project> getProjects() {
		Session session = HibernateUtils.getSessionFactory().openSession();
		session.beginTransaction();

		SQLQuery query = session.createSQLQuery(Queries.SELECT_PROJECTS_QUERY);
		query.addScalar("projectId", LongType.INSTANCE);
		query.addScalar("noOfTasks", IntegerType.INSTANCE);
		query.addScalar("tasksCompleted", IntegerType.INSTANCE);
		query.addScalar("tasksCancelled", IntegerType.INSTANCE);
		query.addScalar("technologies", StringType.INSTANCE);
		query.addScalar("challengesTypes", StringType.INSTANCE);
		query.addScalar("daysDuration", IntegerType.INSTANCE);
		query.addScalar("avgAward", LongType.INSTANCE);
		query.addScalar("avgSubmissions", IntegerType.INSTANCE);
		query.addScalar("avgRegistrants", IntegerType.INSTANCE);
		query.setResultTransformer(Transformers.aliasToBean(Project.class));

		@SuppressWarnings("unchecked")
		List<Project> list = query.list();

		for (Project project : list) {
			List<String> uniqueTechs = new ArrayList<>();
			String technologies = project.getTechnologies();
			String[] techArray = technologies.split(",");
			for (String tech : techArray) {
				String cleanTech = tech.trim();
				cleanTech = cleanTech.replace(".", "");
				cleanTech = cleanTech.replace("#", "sharp");
				if (!uniqueTechs.contains(cleanTech)) {
					uniqueTechs.add(cleanTech);
				}
			}
			project.setTechsList(uniqueTechs);
		}
		
		for (Project project : list) {
			List<String> uniqueChalTypes = new ArrayList<>();
			String chalTypes = project.getChallengesTypes();
			String[] chalTypesArray = chalTypes.split(",");
			for (String type : chalTypesArray) {
				String cleanType = type.trim();
				cleanType = cleanType.replace(" ", "");
				if (!uniqueChalTypes.contains(cleanType)) {
					uniqueChalTypes.add(cleanType);
				}
			}
			project.setChalTypesList(uniqueChalTypes);
		}
		
		return list;
	}

	/**
	 * Endpoint that returns a matrix of distribution based on technology and platform
	 * @return
	 */
	@RequestMapping("/matrix")
	public Map<String, Integer> getMatrix() {
		Session session = HibernateUtils.getSessionFactory().openSession();
		session.beginTransaction();

		Criteria criteria = session.createCriteria(Challenge.class);
		List<Challenge> challenges = criteria.list();

		String[] mostTechs = 
			{"javascript","ios","html","css","java","nodejs","android","angularjs","html5","apex","jquery",
			"visualforce","other","bootstrap","salesforce","api","jsp","postgresql","mongodb","php"};

		String[] mostPlats =
			{"other","ios","html","nodejs","android","salesforce","mobile","forcecom","wordpress","ec2"};

		Map<String, Integer> matrix = new LinkedHashMap<>();
		for (String plat : mostPlats) {
			for (String tech : mostTechs) {
				matrix.put(plat+","+tech, 0);
			}
		}

		for (Challenge challenge : challenges) {
			String platforms = challenge.getPlatforms();
			String technologies = challenge.getTechnologies();

			platforms = platforms.toLowerCase().trim();
			platforms = platforms.replace(".", "");
			platforms = platforms.replace("#", "sharp");
			platforms = platforms.replace(" ", "");

			technologies = technologies.toLowerCase().trim();
			technologies = technologies.replace(".", "");
			technologies = technologies.replace("#", "sharp");
			technologies = technologies.replace(" ", "");

			for (String tech : mostTechs) {
				if (!technologies.contains(tech))
					continue;
				for (String plat : mostPlats) {
					if (!platforms.contains(plat))
						continue;
					String pair = plat + "," + tech;
					if (matrix.containsKey(pair)) {
						matrix.put(pair, matrix.get(pair) + 1);
					} else {
						matrix.put(pair, 1);
					}
				}
			}
		}

		for(Map.Entry<String, Integer> entry : matrix.entrySet()) {
			if (entry.getValue() >= 500) {
				matrix.put(entry.getKey(), 4);
			} else if(entry.getValue() >= 100) {
				matrix.put(entry.getKey(), 3);
			} else if(entry.getValue() >= 10) {
				matrix.put(entry.getKey(), 2);
			} else {
				matrix.put(entry.getKey(), 1);
			}
		}

		return matrix;
	}
}
