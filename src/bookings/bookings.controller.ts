import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../auth/roles.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
@Controller("bookings")
export class BookingsController {
  constructor(private svc: BookingsService) {}
  /**
   * Create a new booking
   * @param dto Booking data
   * @returns Created booking
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("PROVIDER", "ADMIN")
  @ApiOperation({ summary: "Create a new booking", description: "Creates a booking. Only users with PROVIDER or ADMIN roles are allowed." })
  @ApiResponse({ status: 201, description: "Booking created successfully." })
  @ApiResponse({ status: 400, description: "Invalid booking data." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 403, description: "Forbidden. Insufficient role." })
  create(@Body() dto: CreateBookingDto) {
    return this.svc.create(dto);
  }

  /**
   * Get a booking by ID
   * @param id Booking ID
   * @returns Booking details
   */
  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get a booking by ID", description: "Retrieves booking details by booking ID. Requires authentication." })
  @ApiResponse({ status: 200, description: "Booking details retrieved successfully." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 404, description: "Booking not found." })
  get(@Param("id", ParseIntPipe) id: number) {
    return this.svc.findById(id);
  }

  /**
   * List bookings with pagination and filtering
   * @param page Page number
   * @param size Page size
   * @param upcoming Filter for upcoming bookings
   * @returns Paginated list of bookings
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "List upcoming/past bookings (paginated)", description: "Retrieves a paginated list of bookings. Use the 'upcoming' query parameter to filter for upcoming or past bookings." })
  @ApiOperation({
    summary: "List bookings",
    description: "Query parameters: page (number, default 1), size (number, default 10), upcoming (boolean, default true)",
  })
  @ApiResponse({ status: 200, description: "Paginated list of bookings retrieved successfully." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @ApiResponse({ status: 400, description: "Invalid query parameters." })
  @ApiResponse({ status: 404, description: "No bookings found." })
  @ApiResponse({ status: 500, description: "Internal server error." })
  @ApiOperation({
    summary: "List bookings with pagination and filtering",
    description: "Retrieves a paginated list of bookings. Query parameters: page (number, default 1), size (number, default 10), upcoming (boolean, default true).",
  })
  @ApiQuery({ name: "page", required: false, type: Number, description: "Page number (default: 1)", example: 1 })
  @ApiQuery({ name: "size", required: false, type: Number, description: "Page size (default: 10)", example: 10 })
  @ApiQuery({ name: "upcoming", required: false, type: Boolean, description: "Filter for upcoming bookings (default: true)", example: true })
  list(
    @Query("page") page = "1",
    @Query("size") size = "10",
    @Query("upcoming") upcoming = "true"
  ) {
    return this.svc.list(
      parseInt(page, 10),
      parseInt(size, 10),
      upcoming === "true"
    );
  }
}
