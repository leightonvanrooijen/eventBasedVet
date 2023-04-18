Feature: Vets can preform procedures

  @procedure
  Scenario: vet preforms a procedure
    Given a vet is preforming a procedure
    When the vet consumes a good
    And the vet completes the procedure
    Then the procedure is completed with the consumed goods on it

  @procedure
  Scenario: Create a Procedure
    When a user creates a procedure
    Then the procedure is created

  @procedure
  Scenario: Begin a Procedure
    Given the procedure has been created
    When a vet begins the procedure
    Then the procedure is began

  @procedure
  Scenario: Consuming goods during procedure
    Given a vet is preforming a procedure
    When a user consumes a good during a procedure
    Then the good is consumed

