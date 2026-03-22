package io.criew.nextuntis.student;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

@Entity
@Table(name = "students")
public class Student {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotNull
  @Size(min = 1, max = 100)
  @Column(name = "first_name", nullable = false, length = 100)
  private String firstName;

  @NotNull
  @Size(min = 1, max = 100)
  @Column(name = "last_name", nullable = false, length = 100)
  private String lastName;

  @NotNull
  @Column(name = "date_of_birth", nullable = false)
  private LocalDate dateOfBirth;

  @NotNull
  @Min(1)
  @Max(13)
  @Column(name = "grade_level", nullable = false)
  private Integer gradeLevel;

  @Email
  @Column(name = "email", nullable = true, length = 255)
  private String email;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public LocalDate getDateOfBirth() {
    return dateOfBirth;
  }

  public void setDateOfBirth(LocalDate dateOfBirth) {
    this.dateOfBirth = dateOfBirth;
  }

  public Integer getGradeLevel() {
    return gradeLevel;
  }

  public void setGradeLevel(Integer gradeLevel) {
    this.gradeLevel = gradeLevel;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }
}
