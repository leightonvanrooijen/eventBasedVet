Feature: Vets can preform procedures

  @acceptance
  Scenario: vet preforms a procedure
    Given a vet is preforming a procedure
    When the vet consumes a good
    And the vet completes the procedure
    Then the procedure is completed with the consumed events on it