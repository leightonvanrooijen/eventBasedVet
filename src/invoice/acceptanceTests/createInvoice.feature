Feature: Ability to create invoices

  @invoice
  Scenario: procedure is completed
    When a procedure is completed
    Then a invoice is generated containing the goods consumed on the procedure

