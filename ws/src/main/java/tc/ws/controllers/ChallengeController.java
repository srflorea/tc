package tc.ws.controllers;

//import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import tc.ws.models.Challenge;
//import tc.ws.utils.HibernateUtils;

@RestController
public class ChallengeController {

	@SuppressWarnings("unchecked")
	@RequestMapping("/challenge")
	public Challenge challenge() {
		
		/*Session session = HibernateUtils.getSessionFactory().openSession();
		session.beginTransaction();
		
		Criteria criteria = session.createCriteria(Challenge.class);
		criteria.add(Restrictions.eq(Challenge.Fields.PROJECT_ID.getName(), 6680l));
		List<Challenge> challenges = criteria.list();
		*/
		return new Challenge(10, "challenges");
	}
}
