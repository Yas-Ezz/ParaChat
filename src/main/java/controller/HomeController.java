package controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    /**
     * Serves the index.html file from the static resources.
     * When a user navigates to the root URL ("/"), this method will return "index",
     * which Spring Boot will resolve to src/main/resources/static/index.html by default.
     * @return The name of the view (index.html)
     */
    @GetMapping("/")
    public String index() {
        return "index.html"; // Spring Boot will look for this in src/main/resources/static/
    }
}
