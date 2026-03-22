package io.criew.nextuntis.student;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.criew.nextuntis.config.JacksonConfig;
import io.criew.nextuntis.model.StudentRequest;
import io.criew.nextuntis.model.StudentResponse;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.openapitools.jackson.nullable.JsonNullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

@WebMvcTest(StudentController.class)
@Import(JacksonConfig.class)
class StudentControllerTest {

  @Autowired private MockMvc mockMvc;

  @Autowired private ObjectMapper objectMapper;

  @MockBean private StudentService studentService;

  private StudentResponse sampleResponse() {
    StudentResponse response = new StudentResponse();
    response.setId(1L);
    response.setFirstName("Max");
    response.setLastName("Mustermann");
    response.setDateOfBirth(LocalDate.of(2010, 5, 15));
    response.setGradeLevel(7);
    response.setEmail(JsonNullable.of(null));
    return response;
  }

  private StudentRequest sampleRequest() {
    StudentRequest request = new StudentRequest();
    request.setFirstName("Max");
    request.setLastName("Mustermann");
    request.setDateOfBirth(LocalDate.of(2010, 5, 15));
    request.setGradeLevel(7);
    return request;
  }

  @Test
  @WithMockUser
  void listStudents_returns200WithList() throws Exception {
    when(studentService.findAll()).thenReturn(List.of(sampleResponse()));

    mockMvc
        .perform(get("/api/students"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value(1))
        .andExpect(jsonPath("$[0].firstName").value("Max"));
  }

  @Test
  @WithMockUser
  void createStudent_returns201WithCreatedStudent() throws Exception {
    when(studentService.create(any(StudentRequest.class))).thenReturn(sampleResponse());

    mockMvc
        .perform(
            post("/api/students")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleRequest())))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.firstName").value("Max"));
  }

  @Test
  @WithMockUser
  void getStudent_returns200WhenFound() throws Exception {
    when(studentService.findById(1L)).thenReturn(sampleResponse());

    mockMvc
        .perform(get("/api/students/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1));
  }

  @Test
  @WithMockUser
  void getStudent_returns404WhenNotFound() throws Exception {
    when(studentService.findById(999L))
        .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found"));

    mockMvc.perform(get("/api/students/999")).andExpect(status().isNotFound());
  }

  @Test
  @WithMockUser
  void updateStudent_returns200WithUpdatedStudent() throws Exception {
    when(studentService.update(eq(1L), any(StudentRequest.class))).thenReturn(sampleResponse());

    mockMvc
        .perform(
            put("/api/students/1")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleRequest())))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(1));
  }

  @Test
  @WithMockUser
  void deleteStudent_returns204() throws Exception {
    doNothing().when(studentService).delete(1L);

    mockMvc.perform(delete("/api/students/1").with(csrf())).andExpect(status().isNoContent());
  }
}
