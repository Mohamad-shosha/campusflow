package sa.edu.fbsu.campus.architecture;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;

@AnalyzeClasses(packages = "sa.edu.fbsu.campus", importOptions = ImportOption.DoNotIncludeTests.class)
public class ArchitectureGovernanceTest {

    @ArchTest
    static final ArchRule controllersShouldOnlyResideInApiPackages =
            classes().that().areAnnotatedWith(RestController.class)
                    .should().resideInAPackage("..api..")
                    .allowEmptyShould(true)
                    .as("Controllers must strictly reside in api packages");

    @ArchTest
    static final ArchRule servicesShouldOnlyResideInApplicationOrDomainPackages =
            classes().that().areAnnotatedWith(Service.class)
                    .should().resideInAnyPackage("..application..", "..domain..", "..common..")
                    .allowEmptyShould(true)
                    .as("Services must reside in application or domain or common packages");

    @ArchTest
    static final ArchRule repositoriesShouldOnlyResideInInfraOrDomainPackages =
            classes().that().areAnnotatedWith(Repository.class)
                    .should().resideInAnyPackage("..infra..", "..domain..", "..common..")
                    .allowEmptyShould(true)
                    .as("Repositories must reside in infra or domain or common packages");
}
